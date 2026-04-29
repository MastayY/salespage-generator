import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const requestSchema = z.object({
  productName: z.string().min(2),
  description: z.string().min(10),
  features: z.array(z.string().min(2)).min(1),
  targetAudience: z.string().min(2),
  price: z.string().min(1),
  usps: z.string().min(5),
  templateStyle: z.string().min(2).optional(),
  imageUrl: z.string().url().optional().nullable(),
});

const responseSchema = z.object({
  headline: z.string().max(96),
  subHeadline: z.string().max(180),
  productDescription: z.string(),
  benefits: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .min(1)
    .max(3),
  features: z
    .array(
      z.object({
        name: z.string(),
        brief_detail: z.string(),
      })
    )
    .min(3)
    .max(6),
  socialProof: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
  }),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .length(3),
  pricing: z.string(),
  ctaText: z.string(),
});

const systemInstruction = `You are an elite copywriter for high-end SaaS products. Write in a sophisticated, confident, and minimalist tone—like a high-profile tech keynote presentation. Do NOT use cheap, loud, or hype-driven sales jargon. Speak softly but with authority. Return ONLY valid JSON matching the exact schema.`;

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    const userPrompt = {
      productName: input.productName,
      description: input.description,
      targetAudience: input.targetAudience,
      price: input.price,
      features: input.features,
      uniqueSellingPoints: input.usps,
      imageProvided: Boolean(input.imageUrl),
      outputSchema: {
        headline: "string, max 12 words",
        subHeadline: "string, max 25 words",
        productDescription: "string",
        benefits: "array (max 3) of {title, description}",
        features: "array (min 3, max 6) of {name, brief_detail}",
        socialProof: "{quote, author, role}",
        faq: "array of 3 {question, answer}",
        pricing: "string",
        ctaText: "string",
      },
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: JSON.stringify(userPrompt) }] }],
      generationConfig: {
        temperature: 0.6,
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    const parsed = responseSchema.parse(JSON.parse(text));

    const uspsArray = input.usps
      .split(/\n|•|\u2022/)
      .map((item) => item.trim())
      .filter(Boolean);

    const salesPage = await prisma.salesPage.create({
      data: {
        userId: session.user.id,
        productName: input.productName,
        description: input.description,
        features: input.features,
        targetAudience: input.targetAudience,
        price: input.price,
        usps: uspsArray.length > 0 ? uspsArray : [input.usps],
        generatedContent: parsed,
        imageUrl: input.imageUrl ?? null,
        templateStyle: input.templateStyle ?? "Shopify Dark",
      },
      select: { id: true },
    });

    return Response.json({ id: salesPage.id, content: parsed });
  } catch (error) {
    console.error("Generate page error", error);
    return new Response("Failed to generate sales page", { status: 500 });
  }
}
