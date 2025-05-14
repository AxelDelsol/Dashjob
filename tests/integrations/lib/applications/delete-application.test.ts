import createApplication from "@/lib/applications/create-application";
import { ApplicationStatus } from "@/lib/applications/definitions";
import deleteUserApplication from "@/lib/applications/delete-application";
import { findUserApplicationById } from "@/lib/applications/get-applications";
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

describe("deleteUserApplication", () => {
  it("deletes a user application", async () => {
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

    const result = await deleteUserApplication(
      userApplication.userId,
      userApplication.id,
    );
    expect(result.count).toBe(1);

    const application = await findUserApplicationById(
      user.id,
      userApplication.id,
    );

    expect(application).toBeUndefined();
  });

  it("does not fail when the application does not exist", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const result = await deleteUserApplication(user.id, 42);
    expect(result.count).toBe(0);
  });

  it("does not delete another user's application", async () => {
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

    const result = await deleteUserApplication(
      user.id,
      exustingUserAppplication.id,
    );

    expect(result.count).toBe(0);
  });
});
