import { redirect } from "next/navigation";

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  redirect(`/club/${params.id}/about`);
  return null;
}