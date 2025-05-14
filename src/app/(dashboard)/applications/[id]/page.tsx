import { auth } from "@/auth";
import Status from "@/components/shared/status";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import deleteApplicationAction from "@/lib/applications/delete/server-actions";
import { findUserApplicationById } from "@/lib/applications/get-applications";
import formatDate from "@/lib/shared/format-date";
import Link from "next/link";
import { notFound, unauthorized } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const session = await auth();
  const user = session?.user;

  if (!user) return unauthorized();

  const params = await props.params;
  const id = params.id;
  const application = await findUserApplicationById(user.userId, id);

  if (!application) {
    notFound();
  }

  return (
    <Card className="container my-10 w-[750px]">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">
          {application.title}
        </CardTitle>
        <CardDescription className="text-center text-3xl font-bold">
          {application.companyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Section title="Statut de la candidature">
          <Status status={application.status} />
        </Section>
        <Section title="Date de candidature">
          <p>{formatDate(application.applicationDate)}</p>
        </Section>
        <Section title="Salaire annuel brut">
          {application.annualSalary && <p>{`${application.annualSalary} €`}</p>}
        </Section>
        <Section title="Informations additionnelles">
          {application.description && (
            <p className="whitespace-pre-wrap">{application.description}</p>
          )}
        </Section>
        <div className="pt-2 flex justify-center gap-6">
          <Button variant="outline" asChild>
            <Link href="/applications">Modifier (TBA)</Link>
          </Button>
          <DeleteApplication
            userId={user.userId}
            applicationId={application.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Section(props: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold">{props.title}</h2>
      <div className="p-1 ml-4">{props.children || "-"}</div>
    </div>
  );
}

function DeleteApplication({
  userId,
  applicationId,
}: {
  userId: number;
  applicationId: number;
}) {
  const deleteApplicationWithId = deleteApplicationAction.bind(
    null,
    userId,
    applicationId,
  );

  return (
    <form action={deleteApplicationWithId}>
      <Button type="submit" variant="destructive" className="cursor-pointer">
        Supprimer
      </Button>
    </form>
  );
}
