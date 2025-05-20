"use client";

import ErrorText from "@/components/shared/error-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createApplicationAction,
  CreateApplicationActionState,
} from "@/lib/applications/server-actions";
import formatDate from "@/lib/shared/format-date";
import Link from "next/link";
import { useActionState } from "react";

export default function CreateForm({ userId }: { userId: number }) {
  const action = createApplicationAction.bind(null, userId);
  const initialState: CreateApplicationActionState = { data: {}, errors: {} };
  const [state, formAction, isPending] = useActionState(action, initialState);
  return (
    <form action={formAction} aria-describedby="form-error">
      <div className="grid w-full items-center gap-4">
        <div className="mb-4">
          <div className="flex flex-row gap-14">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Statut de la candidature</Label>
              <Select
                name="status"
                defaultValue={state.data.status?.toString() || "applied"}
                aria-describedby="status-error"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Envoyée</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="rejected">Refusée</SelectItem>
                  <SelectItem value="accepted">Acceptée</SelectItem>
                </SelectContent>
              </Select>
              <ErrorText
                id="status-error"
                error_messages={state.errors.status}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="applicationDate">Date de candidature</Label>
              <Input
                type="date"
                name="applicationDate"
                id="applicationDate"
                aria-describedby="applicationDate-error"
                className="w-fit"
                defaultValue={formatDate(
                  state.data.applicationDate
                    ? new Date(state.data.applicationDate.toString())
                    : new Date(),
                )}
                required
              />
              <ErrorText
                id="applicationDate-error"
                error_messages={state.errors.applicationDate}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="companyName">Entreprise</Label>
            <Input
              type="text"
              name="companyName"
              id="companyName"
              aria-describedby="companyName-error"
              className="w-3/5"
              defaultValue={state.data.companyName?.toString()}
              required
            />
            <ErrorText
              id="companyName-error"
              error_messages={state.errors.companyName}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title">Intitulé du poste</Label>
            <Input
              type="text"
              name="title"
              id="title"
              aria-describedby="title-error"
              className="w-3/5"
              defaultValue={state.data.title?.toString()}
              required
            />
            <ErrorText id="title-error" error_messages={state.errors.title} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="annualSalary">
              Salaire annuel brut (optionnel)
            </Label>
            <Input
              type="number"
              name="annualSalary"
              id="annualSalary"
              aria-describedby="annualSalary-error"
              className="w-fit"
              max="999999"
              defaultValue={state.data.annualSalary?.toString()}
            />
            <ErrorText
              id="annualSalary-error"
              error_messages={state.errors.annualSalary}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">
              Informations additionnelles (optionnelles)
            </Label>
            <Textarea
              name="description"
              id="description"
              aria-describedby="description-error"
              maxLength={200}
              defaultValue={state.data.description?.toString()}
            />
            <ErrorText
              id="description-error"
              error_messages={state.errors.description}
            />
          </div>
        </div>

        <div className="flex justify-start gap-6">
          <Button variant="outline" asChild>
            <Link href="/applications">Annuler</Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-blue-500 text-white transition-colors hover:bg-blue-400"
          >
            {isPending ? "Création..." : "Créer la candidature"}
          </Button>
        </div>
      </div>
    </form>
  );
}
