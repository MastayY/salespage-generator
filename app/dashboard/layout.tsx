import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-void text-shopify-white">
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-8">
        <aside className="hidden w-64 flex-col gap-6 rounded-md border border-dark-card-border bg-deep-teal p-6 shadow-card lg:flex">
          <div className="space-y-2">
            <p className="text-[15.36px] tracking-[1.54px] text-muted">
              DASHBOARD
            </p>
            <h2 className="font-display text-[28px] leading-[1.28]">
              Welcome, {session.user?.name ?? "creator"}
            </h2>
          </div>
          <nav className="flex flex-col gap-3 text-[18px] font-medium">
            <Link className="text-shopify-white hover:text-muted" href="/dashboard">
              Overview
            </Link>
            <Link
              className="text-shopify-white hover:text-muted"
              href="/dashboard/generate"
            >
              Generate new page
            </Link>
          </nav>
          <div className="mt-auto">
            <SignOutButton />
          </div>
        </aside>
        <section className="flex-1">{children}</section>
      </div>
    </div>
  );
}
