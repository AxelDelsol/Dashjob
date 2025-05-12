"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/lib/users/sign-in/server-actions";
import Link from "next/link";
import { useActionState } from "react";

export default function SignInForm() {
  const initialState: string = "";
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <form action={formAction} aria-describedby="form-error">
      <div className="grid w-full items-center gap-4">
        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state && (
            <p className="mt-2 text-red-500" key={state}>
              {state}
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
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              type="password"
              name="password"
              id="password"
              aria-describedby="password-error"
            />
          </div>
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
            {isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </div>
      </div>
    </form>
  );
}
