import {
  ApplicationStatus,
  createUserApplication,
  deleteUserApplication,
  findUserApplicationById,
  findUserApplications,
  updateUserApplication,
} from "@/lib/applications/applications";
import sql from "@/lib/shared/db";
import { createUser, UserStatus } from "@/lib/users/users";
import { clearDatabase } from "../../db-helpers";

beforeEach(() => {
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

    const application = await createUserApplication(user.id, {
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
    const exustingUserAppplication = await createUserApplication(
      existingUser.id,
      {
        title: "title",
        companyName: "foo",
        status: ApplicationStatus.Applied,
        applicationDate: new Date("2021-03-25"),
        description: "long job description",
        annualSalary: 42000,
      },
    );

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

    const userApplication = await createUserApplication(user.id, {
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

describe("createUserApplication", () => {
  it("returns the created application - min infos", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const expectedProperties = {
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
    };

    const application = await createUserApplication(
      user.id,
      expectedProperties,
    );

    expect(application).toMatchObject(expectedProperties);
  });

  it("trims undefined values", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const inputProperties = {
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: undefined,
    };

    const expectedProperties = {
      userId: user.id,
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
    };

    const application = await createUserApplication(user.id, inputProperties);

    expect(application).toMatchObject(expectedProperties);
  });

  it("returns the created application - max infos", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const expectedProperties = {
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: "long job description",
      annualSalary: 42000,
    };

    const application = await createUserApplication(
      user.id,
      expectedProperties,
    );

    expect(application).toMatchObject({
      userId: user.id,
      ...expectedProperties,
    });
  });
});

describe("updateUserApplication", () => {
  it("returns the updated application", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });
    const existingApplication = await createUserApplication(user.id, {
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      description: "some description",
      applicationDate: new Date("2021-03-25"),
    });

    const updatedProperties = {
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: null,
      annualSalary: 42000,
    };

    const application = await updateUserApplication(
      user.id,
      existingApplication.id,
      updatedProperties,
    );

    const expectedProperties = {
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      annualSalary: 42000,
    };

    expect(application).toMatchObject(expectedProperties);
  });
});

describe("deleteUserApplication", () => {
  it("deletes a user application", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const userApplication = await createUserApplication(user.id, {
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
    const exustingUserAppplication = await createUserApplication(
      existingUser.id,
      {
        title: "title",
        companyName: "foo",
        status: ApplicationStatus.Applied,
        applicationDate: new Date("2021-03-25"),
        description: "long job description",
        annualSalary: 42000,
      },
    );

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
