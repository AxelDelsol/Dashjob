
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import PublicPage from "@/components/shared/public-pages";
import SignUpForm from "./_components/signup-form";

export default function Page() {
  return (
    <PublicPage>
      <Card className="container mx-auto w-[750px] p-6">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>L&apos;administrateur validera votre compte avant de pouvoir vous connecter.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </PublicPage>
  )
}