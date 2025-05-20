import sql from "../shared/db";

export type Application = {
  id: number;
  userId: number;
  title: string;
  companyName: string;
  status: ApplicationStatus;
  applicationDate: Date;
  description?: string;
  annualSalary?: number;
};

const columns = [
  "id",
  "userId",
  "title",
  "companyName",
  "status",
  "applicationDate",
  "description",
  "annualSalary",
];

export enum ApplicationStatus {
  Applied = "applied",
  Pending = "pending",
  Rejected = "rejected",
  Accepted = "accepted",
}

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

type CreateApplication = Pick<
  Application,
  | "title"
  | "companyName"
  | "status"
  | "applicationDate"
  | "description"
  | "annualSalary"
>;
export async function createUserApplication(
  userid: number,
  newApplication: CreateApplication,
) {
  const params = {
    userId: userid,
    ...newApplication,
  };
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

type UpdateApplication = Pick<
  Application,
  "title" | "companyName" | "status" | "applicationDate"
> & {
  description: string | null;
  annualSalary: number | null;
};
export async function updateUserApplication(
  userId: number,
  applicationId: number,
  updatedApplication: UpdateApplication,
) {
  const updatedApplications = await sql<Application[]>`
  UPDATE applications SET ${sql(updatedApplication)}
  WHERE user_id = ${userId} AND id = ${applicationId}
  RETURNING *`;

  const application = updatedApplications[0];

  if (!application) return;

  if (application.description === null) {
    delete application.description;
  }

  if (application.annualSalary === null) {
    delete application.annualSalary;
  }

  return application;
}

export async function deleteUserApplication(
  userId: number,
  applicationId: number,
) {
  return sql`
      DELETE FROM applications
      WHERE user_id = ${userId} AND id = ${applicationId}`;
}
