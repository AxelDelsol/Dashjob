import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findUserApplicationById } from "@/lib/applications/get-applications";
import { notFound, unauthorized } from "next/navigation";
import EditForm from "./_components/edit-form";

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
          Editer la candidature
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditForm userId={user.userId} application={application} />
      </CardContent>
    </Card>
  );
}
