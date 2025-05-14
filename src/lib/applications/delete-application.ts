import sql from "../shared/db";

export default async function deleteUserApplication(
  userId: number,
  applicationId: number,
) {
  return await sql`
      DELETE FROM applications
      WHERE user_id = ${userId} AND id = ${applicationId}`;
}
