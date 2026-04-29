import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GenerateForm } from "@/components/dashboard/GenerateForm";

export default async function GeneratePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-[15.36px] tracking-[1.54px] text-muted">
          GENERATE NEW PAGE
        </p>
        <h1 className="font-display text-[48px] leading-none text-shopify-white">
          Capture your product details
        </h1>
        <p className="text-[18px] leading-[1.56] text-muted">
          Complete the form below to generate a structured sales page layout and
          copy powered by AI.
        </p>
      </header>

      <section className="rounded-md border border-dark-card-border bg-dark-forest p-8 shadow-card">
        <GenerateForm />
      </section>
    </div>
  );
}
