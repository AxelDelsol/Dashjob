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
import { createApplicationAction } from "@/lib/actions/create-application";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function Page() {
  const isPending = false;
  return (
    <form action={createApplicationAction} aria-describedby="form-error">
      <div className="grid w-full items-center gap-4">
        {/* <div id="form-error" aria-live="polite" aria-atomic="true">
          {state && (
            <p className="mt-2 text-red-500" key={state}>
              {state}
            </p>
          )}
        </div> */}

        <div className="mb-4">
          <div className="flex flex-row gap-14">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="applicationStatus">
                Statut de la candidature
              </Label>
              <Select
                name="applicationStatus"
                defaultValue="applied"
                aria-describedby="applicationStatus-error"
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
              <ErrorText id="applicationStatus-error" error_messages={"Foo"} />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="applicationDate">Date de candidature</Label>
              <Input
                type="date"
                name="applicationDate"
                id="applicationDate"
                aria-describedby="applicationDate-error"
                className="w-fit"
                defaultValue={formatDate(new Date())}
                required
              />
              <ErrorText id="applicationDate-error" error_messages={"Foo"} />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              type="text"
              name="company"
              id="company"
              aria-describedby="company-error"
              className="w-3/5"
              required
            />
            <ErrorText id="company-error" error_messages={"Foo"} />
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
              required
            />
            <ErrorText id="title-error" error_messages="Foo" />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="annualSalary">Salaire annuel brut</Label>
            <Input
              type="number"
              name="annualSalary"
              id="annualSalary"
              aria-describedby="annualSalary-error"
              className="w-fit"
              min="1"
              max="999999"
            />
            <ErrorText id="annualSalary-error" error_messages={"Foo"} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Informations additionnelles</Label>
            <Textarea
              name="description"
              id="description"
              aria-describedby="description-error"
              maxLength={200}
            />
            <ErrorText id="description-error" error_messages={"Foo"} />
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
