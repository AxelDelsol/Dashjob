import sql from "@/lib/db";
import { Application } from "@/lib/definitions";

export async function fetchApplications(user_id: number) {
  try {
    const data = await sql<Application[]>`
      SELECT 
        applications.id,
        applications.user_id,
        applications.title,
        applications.company_name,
        applications.description,
        applications.status,
        applications.application_date,
        applications.annual_salary
      FROM applications
      WHERE applications.user_id = ${user_id}`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the applications.");
  }
}

export async function fetchApplicationById(user_id: number, id: number) {
  try {
    const data = await sql<Application[]>`
      SELECT 
        applications.id,
        applications.user_id,
        applications.title,
        applications.company_name,
        applications.description,
        applications.status,
        applications.application_date,
        applications.annual_salary
      FROM applications
      WHERE applications.id = ${id} AND applications.user_id = ${user_id}`;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the applications.");
  }
}
