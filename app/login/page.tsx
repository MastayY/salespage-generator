import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-6 rounded-md border border-dark-card-border bg-deep-teal p-8 shadow-card">
        <div className="space-y-3">
          <p className="text-[15.36px] tracking-[1.54px] text-muted">
            WELCOME BACK
          </p>
          <h1 className="font-display text-[48px] leading-none text-shopify-white">
            Sign in to continue
          </h1>
          <p className="text-[18px] leading-[1.56] text-muted">
            Access your sales pages, generation history, and templates with a
            secure Google login.
          </p>
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
