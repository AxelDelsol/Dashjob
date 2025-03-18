import Status from "@/components/shared/status";
import { fetchApplicationById } from "@/lib/applications";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  const application = await fetchApplicationById(id);

  if (!application) {
    notFound();
  }

  return (
    <main className="container mx-auto">
      <div className="flex flex-row gap-1.5 text-4xl font-bold pb-3">
        <h1>Candidature</h1>
        <Status status={application.status} />
      </div>
      <Section title="Intitulé du poste">
        <p>{application.title}</p>
      </Section>
      <Section title="Entreprise">
        <p>{application.company_name}</p>
      </Section>
      <Section title="Date de candidature">
        <p>{formatDate(application.application_date)}</p>
      </Section>
      <Section title="Salaire annuel brut">
        {application.annual_salary &&
          <p>{`${application.annual_salary} €`}</p>
        }
      </Section>
      <Section title="Informations additionnelles">
        {application.description &&
          <p className="whitespace-pre-wrap">{application.description}</p>
        }
      </Section>
    </main>
  )
}

function Section(props: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className="p-1">
      <h2 className="text-xl font-semibold">{props.title}</h2>
      <div className="p-1 ml-4">{props.children || '-'}</div>
    </div>
  )

}