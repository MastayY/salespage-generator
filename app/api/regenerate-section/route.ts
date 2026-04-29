import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const requestSchema = z.object({
  pageId: z.string().min(5),
  section: z.enum(["headline", "ctaText", "benefits"]),
  existingContext: z.object({
    headline: z.string(),
    subHeadline: z.string(),
    productDescription: z.string(),
    benefits: z.array(z.object({ title: z.string(), description: z.string() })),
    features: z.array(z.object({ name: z.string(), brief_detail: z.string() })),
    socialProof: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
    }),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })),
    pricing: z.string(),
    ctaText: z.string(),
  }),
});

const responseSchemas = {
  headline: z.object({ headline: z.string().max(80) }),
  ctaText: z.object({ ctaText: z.string().max(80) }),
  benefits: z.object({
    benefits: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
};

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const input = requestSchema.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("Missing GEMINI_API_KEY", { status: 500 });
    }

    const salesPage = await prisma.salesPage.findFirst({
      where: { id: input.pageId, userId: session.user.id },
      select: { generatedContent: true },
    });

    if (!salesPage) {
      return new Response("Not found", { status: 404 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an elite direct-response copywriter. Rewrite ONLY the requested section.
Return ONLY valid JSON with the requested keys. No markdown or extra text.
Maintain the same tone, vocabulary, and positioning from the existing page context.`,
    });

    const prompt = {
      section: input.section,
      existingContext: input.existingContext,
      outputSchema:
        input.section === "headline"
          ? { headline: "string, max 10 words" }
          : input.section === "ctaText"
          ? { ctaText: "string, action-oriented" }
          : { benefits: "array of {title, description}" },
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: JSON.stringify(prompt) }] }],
      generationConfig: {
        temperature: 0.5,
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    const parsed = responseSchemas[input.section].parse(JSON.parse(text));

    const updatedContent = {
      ...(salesPage.generatedContent as Record<string, unknown>),
      ...parsed,
    };

    await prisma.salesPage.update({
      where: { id: input.pageId },
      data: { generatedContent: updatedContent },
    });

    return Response.json(parsed);
  } catch (error) {
    console.error("Regenerate section error", error);
    return new Response("Failed to regenerate section", { status: 500 });
  }
}
