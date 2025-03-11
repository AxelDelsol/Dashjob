"use client"

import { Application } from "@/lib/definitions"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, NotepadText, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Status from "./status"

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "company",
    header: "Entreprise",
  },
  {
    accessorKey: "creation_date",
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
      )
    },
    cell: ({ row }) => {
      const application = row.original
      return (
        <div className="pl-10">
          {application.creation_date.toISOString().split('T')[0]}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex flex-col ">
          <p>Statut</p>
          <select
            onChange={e => column.setFilterValue(e.target.value)}
            value={column.getFilterValue() as string}
            className="text-base w-30"
          >
            {/* See faceted column filters example for dynamic select options */}
            <option value="">Tous</option>
            <hr />
            <option value="pending">En attente</option>
            <option value="rejected">Refusée</option>
            <option value="accepted">Acceptée</option>
          </select>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className=" font-medium">
          <Status status={row.getValue("status")} />
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <NotepadText className="w-6" />
              <span className="md:block">Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="w-6" />
              <span className="md:block">Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 className="w-6" />
              <span className="md:block">Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
