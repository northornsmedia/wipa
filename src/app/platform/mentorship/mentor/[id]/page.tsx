import { redirect } from 'next/navigation';

export default async function MentorProfileRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/platform/profile/${id}`);
}
