import { redirect } from 'next/navigation';

export default async function WellnessV2DetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/platform/resources/wellness/${id}`);
}
