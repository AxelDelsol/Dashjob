import createApplication from "@/lib/applications/create-application";
import { ApplicationStatus } from "@/lib/applications/definitions";
import sql from "@/lib/shared/db";
import createUser from "@/lib/users/create-user";
import { UserStatus } from "@/lib/users/definitions";
import { clearDatabase } from "../../db-helpers";

describe("createApplication", () => {
  beforeEach(async () => {
    return clearDatabase();
  });

  afterAll(async () => {
    return sql.end();
  });

  it("returns the created application - min infos", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const expectedProperties = {
      userId: user.id,
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
    };

    const application = await createApplication(expectedProperties);

    expect(application).toMatchObject(expectedProperties);
  });

  it("trims undefined values", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const inputProperties = {
      userId: user.id,
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

    const application = await createApplication(inputProperties);

    expect(application).toMatchObject(expectedProperties);
  });

  it("returns the created application - max infos", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const expectedProperties = {
      userId: user.id,
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: "long job description",
      annualSalary: 42000,
    };

    const application = await createApplication(expectedProperties);

    expect(application).toMatchObject(expectedProperties);
  });
});
