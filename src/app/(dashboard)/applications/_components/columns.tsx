"use client";

import { Application } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import Status from "@/components/shared/status";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "company_name",
    header: "Entreprise",
  },
  {
    accessorKey: "application_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-lg font-bold bg-gray-200"
        >
          Date de candidature
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const application = row.original;
      return (
        <div className="pl-10">{formatDate(application.application_date)}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex flex-col ">
          <p>Statut</p>
          <select
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={column.getFilterValue() as string}
            className="text-base w-30"
          >
            <option value="">Tous</option>
            <hr />
            <option value="applied">Envoyée</option>
            <option value="pending">En attente</option>
            <option value="rejected">Refusée</option>
            <option value="accepted">Acceptée</option>
          </select>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" font-medium">
          <Status status={row.getValue("status")} />
        </div>
      );
    },
  },
];
