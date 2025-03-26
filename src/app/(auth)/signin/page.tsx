import PublicPage from "@/components/shared/public-pages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "./_components/signin-form";

export default function Page() {
  return (
    <PublicPage>
      <Card className="container mx-auto w-[750px] p-6">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </PublicPage>
  );
}
