"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

type Benefit = {
  title: string;
  description: string;
};

type Feature = {
  name: string;
  brief_detail: string;
};

type SocialProof = {
  quote: string;
  author: string;
  role: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type GeneratedContent = {
  headline: string;
  subHeadline: string;
  productDescription: string;
  benefits: Benefit[];
  features: Feature[];
  socialProof: SocialProof;
  faq: FaqItem[];
  pricing: string;
  ctaText: string;
};

type SalesPagePreviewProps = {
  pageId: string;
  productName: string;
  imageUrl?: string | null;
  templateStyle: string;
  generatedContent: GeneratedContent;
};

export function SalesPagePreview({
  pageId,
  productName,
  imageUrl,
  templateStyle,
  generatedContent,
}: SalesPagePreviewProps) {
  const normalizedContent = useMemo<GeneratedContent>(() => {
    const featuresSource = Array.isArray(generatedContent.features)
      ? generatedContent.features
      : [];
    const features =
      typeof featuresSource[0] === "string"
        ? (featuresSource as unknown as string[]).map((item) => ({
            name: item,
            brief_detail: "",
          }))
        : (featuresSource as Feature[]);

    const socialProof =
      (generatedContent as unknown as Partial<GeneratedContent>).socialProof ??
      {
        quote: "",
        author: "",
        role: "",
      };

    const faq =
      (generatedContent as unknown as Partial<GeneratedContent>).faq ?? [];

    return {
      ...generatedContent,
      features,
      socialProof,
      faq,
    } as GeneratedContent;
  }, [generatedContent]);

  const [content, setContent] = useState<GeneratedContent>(normalizedContent);
  const [isPreview, setIsPreview] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [regenerating, setRegenerating] = useState<
    Partial<Record<"headline" | "ctaText" | "benefits", boolean>>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isPreview) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isPreview]);

  useEffect(() => {
    setContent(normalizedContent);
  }, [normalizedContent]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const htmlExport = useMemo(() => {
    const safeHeadline = content.headline;
    const safeSub = content.subHeadline;
    const safeDesc = content.productDescription;
    const benefitsHtml = content.benefits
      .map(
        (benefit) => `
          <div class="card">
            <h3>${benefit.title}</h3>
            <p>${benefit.description}</p>
          </div>
        `
      )
      .join("");
    const featuresHtml = content.features
      .map(
        (feature) =>
          `<li><strong>${feature.name}</strong> — ${feature.brief_detail}</li>`
      )
      .join("");
    const faqHtml = content.faq
      .map(
        (item) => `
          <div class="card">
            <h3>${item.question}</h3>
            <p>${item.answer}</p>
          </div>
        `
      )
      .join("");

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${productName} — Sales Page</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: Inter, Helvetica, Arial, sans-serif;
      }
      body {
        margin: 0;
        background: #000000;
        color: #ffffff;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 64px 24px;
      }
      .hero {
        padding: 96px 0;
        text-align: center;
        background: radial-gradient(circle at top, #102620 0%, #02090a 45%, #000000 100%);
      }
      .hero h1 {
        font-size: 96px;
        font-weight: 330;
        line-height: 1;
        margin: 0 0 24px;
      }
      .hero p {
        max-width: 720px;
        margin: 0 auto 24px;
        font-size: 20px;
        color: #a1a1aa;
        line-height: 1.4;
      }
      .section {
        padding: 80px 0;
      }
      .grid {
        display: grid;
        gap: 24px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
      .card {
        background: #02090a;
        border: 1px solid #1e2c31;
        border-radius: 12px;
        padding: 24px;
        box-shadow: rgba(0,0,0,0.1) 0px 0px 0px 1px,
          rgba(0,0,0,0.1) 0px 2px 2px, rgba(0,0,0,0.1) 0px 4px 4px,
          rgba(0,0,0,0.1) 0px 8px 8px, rgba(255,255,255,0.03) 0px 1px 0px inset;
      }
      .card h3 {
        font-size: 28px;
        font-weight: 330;
        margin: 0 0 8px;
      }
      .card p {
        color: #a1a1aa;
        line-height: 1.5;
      }
      ul {
        margin: 0;
        padding-left: 20px;
        color: #d4d4d8;
      }
      .cta {
        display: inline-block;
        background: #ffffff;
        color: #000000;
        padding: 12px 26px;
        border-radius: 9999px;
        text-decoration: none;
      }
      .image {
        width: 100%;
        border-radius: 12px;
        border: 1px solid #1e2c31;
        background: #02090a;
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <div class="container">
        <h1>${safeHeadline}</h1>
        <p>${safeSub}</p>
        <p>${safeDesc}</p>
        ${imageUrl ? `<img class="image" src="${imageUrl}" alt="${productName}" />` : ""}
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid">${benefitsHtml}</div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="card">
          <h3>Features</h3>
          <ul>${featuresHtml}</ul>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="card">
          <h3>${content.pricing}</h3>
          <p>“${content.socialProof.quote}”</p>
          <p>${content.socialProof.author} — ${content.socialProof.role}</p>
          <a class="cta" href="#">${content.ctaText}</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid">${faqHtml}</div>
      </div>
    </section>
  </body>
</html>`;
  }, [content, imageUrl, productName]);

  const regenerateSection = async (section: "headline" | "ctaText" | "benefits") => {
    setErrorMessage(null);
    setRegenerating((prev) => ({ ...prev, [section]: true }));

    const response = await fetch("/api/regenerate-section", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageId,
        section,
        existingContext: content,
      }),
    });

    if (!response.ok) {
      setErrorMessage("Regeneration failed. Please try again.");
      setRegenerating((prev) => ({ ...prev, [section]: false }));
      return;
    }

    const data = (await response.json()) as Partial<GeneratedContent>;
    setContent((prev) => ({ ...prev, ...data }));
    setRegenerating((prev) => ({ ...prev, [section]: false }));
  };

  const downloadHtml = () => {
    const blob = new Blob([htmlExport], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-sales-page.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const PreviewContent = () => (
    <div className="bg-void text-shopify-white">
      <header
        className={`sticky top-0 z-40 border-b border-transparent transition-all ${
          isScrolled
            ? "border-dark-card-border bg-forest/90 backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3 text-[18px] font-medium tracking-[0.72px]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dark-card-border bg-deep-teal text-[14px]">
              AI
            </span>
            <span>Sales Page</span>
          </div>
          <Button type="button">
            Start for free
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#102620_0%,#02090A_45%,#000000_100%)] py-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 text-center sm:px-8">
          <p className="text-[15.36px] tracking-[1.54px] text-muted">
            {templateStyle.toUpperCase()}
          </p>
          <div className="group relative">
            <button
              type="button"
              onClick={() => regenerateSection("headline")}
              className="absolute -top-8 right-0 hidden rounded-xs bg-[rgba(255,255,255,0.2)] px-3 py-2 text-[12px] text-shopify-white shadow-card backdrop-blur group-hover:flex"
              disabled={regenerating.headline}
            >
              {regenerating.headline ? "Updating..." : "Regenerate"}
            </button>
            <h1 className="font-display text-[56px] leading-none sm:text-[80px] lg:text-[112px]">
              {content.headline}
            </h1>
          </div>
          <p className="max-w-2xl text-[20px] font-medium leading-[1.4] text-muted">
            {content.subHeadline}
          </p>
          <p className="max-w-3xl text-[18px] leading-[1.56] text-muted">
            {content.productDescription}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button type="button">{content.ctaText}</Button>
            <Button type="button" variant="secondary">
              View demo
            </Button>
          </div>
        </div>
      </section>

      {imageUrl && (
        <section className="py-24">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
            <div className="overflow-hidden rounded-md border border-dark-card-border bg-deep-teal shadow-card">
              <img
                src={imageUrl}
                alt={productName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <section className="py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-[15.36px] tracking-[1.54px] text-muted">
                BENEFITS
              </p>
              <h2 className="font-display text-[48px] leading-none">
                Why customers choose you
              </h2>
            </div>
          </div>
          <div className="group relative">
            <button
              type="button"
              onClick={() => regenerateSection("benefits")}
              className="absolute -top-8 right-0 hidden rounded-xs bg-[rgba(255,255,255,0.2)] px-3 py-2 text-[12px] text-shopify-white shadow-card backdrop-blur group-hover:flex"
              disabled={regenerating.benefits}
            >
              {regenerating.benefits ? "Updating..." : "Regenerate"}
            </button>
            <div className="grid gap-6 md:grid-cols-2">
              {content.benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-md border border-dark-card-border bg-deep-teal p-8 shadow-card"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-neon shadow-[0_0_12px_rgba(54,244,164,0.6)]" />
                    <h3 className="font-display text-[32px] leading-[1.14]">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-[18px] leading-[1.56] text-muted">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-md border border-dark-card-border bg-deep-teal p-8 shadow-card">
              <h3 className="font-display text-[36px] leading-[1.14]">
                Feature breakdown
              </h3>
              <div className="mt-6 space-y-4">
                {content.features.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-start gap-3 rounded-md border border-dark-card-border bg-forest/30 px-4 py-3"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-neon text-neon">
                      ✓
                    </span>
                    <div>
                      <p className="text-[18px] font-medium text-shopify-white">
                        {feature.name}
                      </p>
                      <p className="text-[16px] leading-[1.56] text-muted">
                        {feature.brief_detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-dark-card-border bg-deep-teal p-8 shadow-card">
              <p className="text-[15.36px] tracking-[1.54px] text-muted">
                SOCIAL PROOF
              </p>
              <div className="mt-6 space-y-4">
                <p className="text-[48px] leading-none text-shopify-white/80">“</p>
                <p className="text-[24px] leading-[1.4] text-shopify-white">
                  {content.socialProof.quote}
                </p>
                <p className="text-[16px] uppercase tracking-[0.28px] text-muted">
                  — {content.socialProof.author}, {content.socialProof.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="rounded-md border border-dark-card-border bg-deep-teal p-8 shadow-card">
            <p className="text-[15.36px] tracking-[1.54px] text-muted">
              FAQ
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {content.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-md border border-dark-card-border bg-forest/30 p-6"
                >
                  <h4 className="font-display text-[24px] leading-[1.14]">
                    {item.question}
                  </h4>
                  <p className="mt-3 text-[16px] leading-[1.56] text-muted">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark-forest py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="group relative rounded-md border border-dark-card-border bg-deep-teal p-10 shadow-card">
            <button
              type="button"
              onClick={() => regenerateSection("ctaText")}
              className="absolute -top-8 right-0 hidden rounded-xs bg-[rgba(255,255,255,0.2)] px-3 py-2 text-[12px] text-shopify-white shadow-card backdrop-blur group-hover:flex"
              disabled={regenerating.ctaText}
            >
              {regenerating.ctaText ? "Updating..." : "Regenerate"}
            </button>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[15.36px] tracking-[1.54px] text-muted">
                  PRICING
                </p>
                <h3 className="font-display text-[64px] leading-none sm:text-[80px]">
                  {content.pricing}
                </h3>
                <p className="mt-3 text-[18px] leading-[1.56] text-muted">
                  {content.productDescription}
                </p>
              </div>
              <Button type="button" className="text-[16px]">
                {content.ctaText}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[15.36px] tracking-[1.54px] text-muted">
            LIVE PREVIEW
          </p>
          <h2 className="font-display text-[32px] leading-[1.14]">
            {productName}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={downloadHtml}>
            Export HTML
          </Button>
          <Button type="button" onClick={() => setIsPreview(true)}>
            Fullscreen preview
          </Button>
        </div>
      </div>

      <PreviewContent />

      {isPreview && (
        <div className="fixed inset-0 z-50 overflow-auto bg-void">
          <div className="flex justify-end px-6 py-4">
            <Button type="button" variant="secondary" onClick={() => setIsPreview(false)}>
              Exit preview
            </Button>
          </div>
          <PreviewContent />
        </div>
      )}
      {errorMessage && (
        <div className="rounded-md border border-dark-card-border bg-deep-teal px-4 py-3 text-[14px] text-neon shadow-card">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
