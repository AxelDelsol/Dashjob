import sql from "../shared/db";
import { Application } from "./definitions";

export type UpdateApplication = Pick<
  Application,
  "title" | "companyName" | "status" | "applicationDate"
> & {
  description: string | null;
  annualSalary: number | null;
};
export default async function updateApplication(
  userId: number,
  applicationId: number,
  updatedApplication: UpdateApplication,
) {
  const updatedApplications = await sql<Application[]>`
  UPDATE applications SET ${sql(updatedApplication)}
  WHERE user_id = ${userId} AND id = ${applicationId}
  RETURNING *`;

  const application = updatedApplications[0];
  if (application.description === null) {
    delete application.description;
  }

  if (application.annualSalary === null) {
    delete application.annualSalary;
  }

  return application;
}
