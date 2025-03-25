'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction, SignUpError } from "@/lib/actions";
import Link from "next/link";
import { useActionState } from "react";


export default function SignUpForm() {
  const initialState: SignUpError = {};
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction}>
      <div className="grid w-full items-center gap-4">
        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              aria-describedby="email-error"
              placeholder="email@example.com"
            />
          </div>
          <ErrorText id="email-error" error_messages={state.email} />
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <p className="text-muted-foreground text-sm">Saisissez au moins 13 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial.</p>
            <Input
              type="password"
              name="password"
              id="password"
              aria-describedby="password-error" />
          </div>
          <ErrorText id="password-error" error_messages={state.password} />
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="confirmedPassword">Confirmer le mot de passe</Label>
            <Input
              type="password"
              name="confirmedPassword"
              id="confirmedPassword"
              aria-describedby="confirmedPassword-error" />
          </div>
          <ErrorText id="confirmedPassword-error" error_messages={state.confirmedPassword} />
        </div>

        <div className="flex items-center justify-evenly px-6 [.border-t]:pt-6">
          <Button variant="outline" asChild>
            <Link href="/">Annuler</Link>
          </Button>
          <Button type="submit" className="bg-blue-500 text-white transition-colors hover:bg-blue-400">S&apos;inscrire</Button>
        </div>
      </div>
    </form>
  );
}

function ErrorText({ id, error_messages }: { id: string, error_messages?: string[] }) {
  if (error_messages) {
    return (
      <div id={id} aria-live="polite" aria-atomic="true">
        {error_messages.map((error: string) => (
          <p className="mt-2 text-sm text-red-500" key={error}>
            {error}
          </p>
        ))}
      </div>
    )
  }

}