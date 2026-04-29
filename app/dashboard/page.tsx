import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const salesPages = await prisma.salesPage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      productName: true,
      templateStyle: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[15.36px] tracking-[1.54px] text-muted">
            YOUR SALES PAGES
          </p>
          <h1 className="font-display text-[48px] leading-none text-shopify-white">
            Dashboard
          </h1>
        </div>
        <Link
          href="/dashboard/generate"
          className="inline-flex items-center justify-center rounded-pill border-2 border-transparent bg-shopify-white px-6 py-3 text-[16px] font-normal leading-normal text-shopify-black transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-void"
        >
          Generate New Page
        </Link>
      </header>

      {salesPages.length === 0 ? (
        <div className="rounded-md border border-dark-card-border bg-deep-teal p-8 text-center shadow-card">
          <h2 className="font-display text-[32px] leading-[1.14]">
            No sales pages yet
          </h2>
          <p className="mt-3 text-[18px] leading-[1.56] text-muted">
            Start your first generation to see pages appear here.
          </p>
          <Link
            href="/dashboard/generate"
            className="mt-6 inline-flex items-center justify-center rounded-pill border-2 border-transparent bg-shopify-white px-6 py-3 text-[16px] font-normal leading-normal text-shopify-black transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          >
            Generate New Page
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {salesPages.map((page) => (
            <div
              key={page.id}
              className="rounded-md border border-dark-card-border bg-deep-teal p-6 shadow-card transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="space-y-2">
                <p className="text-[14px] font-medium uppercase tracking-[0.28px] text-muted">
                  {page.templateStyle}
                </p>
                <h3 className="font-display text-[28px] leading-[1.28]">
                  {page.productName}
                </h3>
                <p className="text-[16px] leading-normal text-muted">
                  Created {page.createdAt.toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/dashboard/page/${page.id}`}
                className="mt-6 inline-flex items-center text-[16px] font-medium text-link-mint hover:text-shopify-white"
              >
                View page →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
