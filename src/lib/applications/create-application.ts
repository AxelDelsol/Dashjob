import sql from "../shared/db";
import { Application } from "./definitions";

export type CreateApplication = Pick<
  Application,
  | "title"
  | "companyName"
  | "status"
  | "applicationDate"
  | "description"
  | "annualSalary"
  | "userId"
>;

export default async function createApplication(params: CreateApplication) {
  Object.keys(params).forEach(
    (key) =>
      params[key as keyof CreateApplication] === undefined &&
      delete params[key as keyof CreateApplication],
  );
  const insertedApplications = await sql`
  INSERT INTO applications ${sql(params)}
  RETURNING *`;

  return insertedApplications[0] as Application;
}
