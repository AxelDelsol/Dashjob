import { fetchApplications } from "@/lib/applications";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export const dynamic = "force-dynamic";

export default async function Page() {
  const applications = await fetchApplications();

  // const session = await auth();

  // if (!session?.user) return null;
  // console.log(session.user);

  return (
    <div className="py-10">
      <DataTable columns={columns} data={applications} />
    </div>
  );
}
