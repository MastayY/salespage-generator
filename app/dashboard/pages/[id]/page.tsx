import { redirect } from "next/navigation";

export default async function LegacySalesPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/page/${id}`);
}
