import createApplication from "@/lib/applications/create-application";
import { ApplicationStatus } from "@/lib/applications/definitions";
import {
  findUserApplicationById,
  findUserApplications,
} from "@/lib/applications/get-applications";
import sql from "@/lib/shared/db";
import createUser from "@/lib/users/create-user";
import { UserStatus } from "@/lib/users/definitions";
import { clearDatabase } from "../../db-helpers";

beforeEach(async () => {
  return clearDatabase();
});

afterAll(async () => {
  return sql.end();
});

describe("findUserApplications", () => {
  it("returns an empty array if the user does not have any", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const applications = await findUserApplications(user.id);

    expect(applications).toHaveLength(0);
  });

  it("returns the applications of the user", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const application = await createApplication({
      userId: user.id,
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: "long job description",
      annualSalary: 42000,
    });

    const applications = await findUserApplications(user.id);

    expect(applications).toContainEqual(application);
  });
});

describe("findUserApplicationById", () => {
  it("returns undefined if the application does not exist", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const application = await findUserApplicationById(user.id, 5);

    expect(application).toBeUndefined();
  });

  it("returns undefined if the application does not belong to the user", async () => {
    const existingUser = await createUser({
      email: "email@existingUser.com",
      password: "password",
      status: UserStatus.Validated,
    });
    const exustingUserAppplication = await createApplication({
      userId: existingUser.id,
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: "long job description",
      annualSalary: 42000,
    });

    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const application = await findUserApplicationById(
      user.id,
      exustingUserAppplication.id,
    );

    expect(application).toBeUndefined();
  });

  it("returns the application if it belongs to the user", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const userApplication = await createApplication({
      userId: user.id,
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: "long job description",
      annualSalary: 42000,
    });

    const application = await findUserApplicationById(
      user.id,
      userApplication.id,
    );

    expect(application).toEqual(userApplication);
  });
});
