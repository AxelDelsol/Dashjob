import sql from "./db";
import { Application } from "./definitions";

export async function fetchApplications() {
  try {
    const data = await sql<Application[]>`
      SELECT applications.id, applications.title, applications.company_name, applications.description, applications.status, applications.application_date
      FROM applications`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the applications.");
  }
}

export async function fetchApplicationById(id: number) {
  try {
    const data = await sql<Application[]>`
      SELECT 
        applications.id,
        applications.title,
        applications.company_name,
        applications.description,
        applications.status,
        applications.application_date,
        applications.annual_salary
      FROM applications
      WHERE applications.id = ${id}`;

    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the applications.");
  }
}
