import { fetchApplicationById } from "@/lib/applications";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const application = await fetchApplicationById(id);

  if (!application) {
    notFound();
  }

  return (
    <h1>Candidature {application.title}!</h1>
  )
}