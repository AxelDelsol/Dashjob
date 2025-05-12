import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateForm from "./_components/create-form";

export default function Page() {
  return (
    <Card className="container my-10 w-[750px]">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">
          Nouvelle candidature
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CreateForm />
      </CardContent>
    </Card>
  );
}
