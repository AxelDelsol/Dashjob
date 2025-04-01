import { auth } from "@/auth";
import { fetchApplications } from "@/lib/applications";
import { unauthorized } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  if (!user) return unauthorized();

  const applications = await fetchApplications(user.user_id);
  return (
    <div className="py-10">
      <DataTable columns={columns} data={applications} />
    </div>
  );
}
