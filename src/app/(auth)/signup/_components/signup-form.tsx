"use client";

import ErrorText from "@/components/shared/error-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction, SignUpError } from "@/lib/actions/sign-up";
import Link from "next/link";
import { useActionState } from "react";

export default function SignUpForm() {
  const initialState: SignUpError = {};
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <form action={formAction} aria-describedby="form-error">
      <div className="grid w-full items-center gap-4">
        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-red-500" key={state.message}>
              {state.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              aria-describedby="email-error"
              placeholder="email@example.com"
              required
            />
          </div>
          <ErrorText id="email-error" error_messages={state?.errors?.email} />
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <p className="text-muted-foreground text-sm">
              Saisissez au moins 13 caractères, dont une minuscule, une
              majuscule, un chiffre et un caractère spécial.
            </p>
            <Input
              type="password"
              name="password"
              id="password"
              aria-describedby="password-error"
              required
            />
          </div>
          <ErrorText
            id="password-error"
            error_messages={state?.errors?.password}
          />
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="confirmedPassword">Confirmer le mot de passe</Label>
            <Input
              type="password"
              name="confirmedPassword"
              id="confirmedPassword"
              aria-describedby="confirmedPassword-error"
              required
            />
          </div>
          <ErrorText
            id="confirmedPassword-error"
            error_messages={state?.errors?.confirmedPassword}
          />
        </div>

        <div className="flex items-center justify-evenly px-6 [.border-t]:pt-6">
          <Button variant="outline" asChild>
            <Link href="/">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 text-white transition-colors hover:bg-blue-400"
          >
            {isPending ? "Inscription..." : "S'inscrire"}
          </Button>
        </div>
      </div>
    </form>
  );
}
