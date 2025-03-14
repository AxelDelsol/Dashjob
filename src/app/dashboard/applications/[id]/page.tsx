import { fetchApplicationById } from "@/lib/applications";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const application = await fetchApplicationById(id);

  return (
    <h1>Candidature {application.title}!</h1>
  )
}