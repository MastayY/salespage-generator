import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-8 lg:px-16">
      <main className="w-full max-w-5xl space-y-10">
        <div className="space-y-6 text-center">
          <p className="text-[15.36px] tracking-[1.54px] text-muted">
            AI SALES PAGE GENERATOR
          </p>
          <h1 className="font-display text-[48px] leading-none text-shopify-white sm:text-[70px] lg:text-[96px]">
            Build cinematic, high-converting sales pages in minutes.
          </h1>
          <p className="mx-auto max-w-2xl text-[20px] font-medium leading-[1.4] text-muted">
            Capture your product details once, then generate a full landing page
            with persuasive copy, structured sections, and Shopify-inspired
            visuals.
          </p>
        </div>

        <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-md border border-dark-card-border bg-deep-teal p-6 shadow-card sm:flex-row">
          <Input placeholder="Product or service name" />
          <Button type="button">Generate</Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button type="button">Start for free</Button>
          </Link>
          <Button type="button" variant="secondary">
            View template
          </Button>
        </div>
      </main>
    </div>
  );
}
