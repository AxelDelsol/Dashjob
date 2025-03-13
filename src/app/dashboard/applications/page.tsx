import { fetchApplications } from "@/lib/applications";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const applications = await fetchApplications();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={applications} />
    </div>
  )
}