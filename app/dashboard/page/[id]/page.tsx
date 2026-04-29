import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SalesPagePreview } from "@/components/dashboard/SalesPagePreview";

export default async function SalesPageDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const salesPage = await prisma.salesPage.findFirst({
    where: { id, userId: session.user.id },
    select: {
      productName: true,
      imageUrl: true,
      templateStyle: true,
      generatedContent: true,
    },
  });

  if (!salesPage) {
    redirect("/dashboard");
  }

  return (
    <SalesPagePreview
      pageId={id}
      productName={salesPage.productName}
      imageUrl={salesPage.imageUrl}
      templateStyle={salesPage.templateStyle}
      generatedContent={salesPage.generatedContent as any}
    />
  );
}
