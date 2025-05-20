import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unauthorized } from "next/navigation";
import CreateForm from "./_components/create-form";

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  if (!user) return unauthorized();

  return (
    <Card className="container my-10 w-[750px]">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">
          Nouvelle candidature
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CreateForm userId={user.userId} />
      </CardContent>
    </Card>
  );
}
