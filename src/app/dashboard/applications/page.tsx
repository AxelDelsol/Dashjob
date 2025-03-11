import { fetchApplications } from "@/lib/applications"
import { columns } from "./columns"
import { DataTable } from "./data-table"

const applications = fetchApplications()

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={applications} />
    </div>
  )
}