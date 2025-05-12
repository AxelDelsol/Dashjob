import sql from "@/lib/shared/db";

export async function clearDatabase() {
  return sql`TRUNCATE users CASCADE;`;
}
