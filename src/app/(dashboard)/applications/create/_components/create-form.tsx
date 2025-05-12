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
import { CreateApplicationActionState } from "@/lib/applications/create/internal-actions";
import { createApplicationAction } from "@/lib/applications/create/server-actions";
import { ApplicationStatus } from "@/lib/applications/definitions";
import formatDate from "@/lib/shared/format-date";
import Link from "next/link";
import { useActionState } from "react";

export default function Page() {
  const initialState: CreateApplicationActionState = { data: {}, errors: {} };
  const [state, formAction, isPending] = useActionState(
    createApplicationAction,
    initialState,
  );
  return (
    <form action={formAction} aria-describedby="form-error">
      <div className="grid w-full items-center gap-4">
        <div className="mb-4">
          <div className="flex flex-row gap-14">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Statut de la candidature</Label>
              <Select
                name="status"
                defaultValue={state.data.status || ApplicationStatus.Applied}
                aria-describedby="status-error"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ApplicationStatus.Applied}>
                    Envoyée
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.Pending}>
                    En attente
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.Rejected}>
                    Refusée
                  </SelectItem>
                  <SelectItem value={ApplicationStatus.Accepted}>
                    Acceptée
                  </SelectItem>
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
                    ? new Date(state.data.applicationDate)
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
              defaultValue={state.data.companyName}
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
              defaultValue={state.data.title}
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
              defaultValue={state.data.annualSalary}
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
              defaultValue={state.data.description}
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
            className="bg-blue-500 text-white transition-colors hover:bg-blue-400"
          >
            {isPending ? "Création..." : "Créer la candidature"}
          </Button>
        </div>
      </div>
    </form>
  );
}
