
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import PublicPage from "@/components/shared/public-pages";
import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <PublicPage>
      <Card className="container mx-auto w-[750px] p-6">
        <CardHeader>
          <CardTitle className="text-green-600 flex justify-center">
            <CircleCheckBig
              width="72"
              height="72" />
          </CardTitle>
          <CardDescription>Inscription prise en compte.</CardDescription>

        </CardHeader>
        <CardContent>
          L&apos;administrateur validera votre compte sous peu. Vous pourrez ensuite vous connecter à votre compte.
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="bg-blue-500 text-white transition-colors hover:bg-blue-400">
            <Link href="/">Retourner à l&apos;accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </PublicPage>
  )
}