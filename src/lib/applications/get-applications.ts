import sql from "../shared/db";
import { Application } from "./definitions";

const columns = [
  "id",
  "userId",
  "title",
  "companyName",
  "description",
  "status",
  "applicationDate",
  "annualSalary",
];

export async function findUserApplications(user_id: number) {
  const data = await sql<Application[]>`
      SELECT ${sql(columns)}
      FROM applications
      WHERE applications.user_id = ${user_id}`;
  return data;
}

export async function findUserApplicationById(user_id: number, id: number) {
  const data = await sql<Application[]>`
      SELECT ${sql(columns)}
      FROM applications
      WHERE applications.id = ${id} AND applications.user_id = ${user_id}`;

  return data[0];
}
