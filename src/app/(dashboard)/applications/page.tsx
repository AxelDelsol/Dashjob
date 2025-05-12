import { auth } from "@/auth";
import { findUserApplications } from "@/lib/applications/get-applications";
import { unauthorized } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  if (!user) return unauthorized();

  const applications = await findUserApplications(user.userId);
  return (
    <div className="py-10">
      <DataTable columns={columns} data={applications} />
    </div>
  );
}
