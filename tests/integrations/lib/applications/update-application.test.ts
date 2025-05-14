import createApplication from "@/lib/applications/create-application";
import { ApplicationStatus } from "@/lib/applications/definitions";
import updateApplication, {
  UpdateApplication,
} from "@/lib/applications/update-application";
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

  it("returns the updated application", async () => {
    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });
    const existingApplication = await createApplication({
      userId: user.id,
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      description: "some description",
      applicationDate: new Date("2021-03-25"),
    });

    const updatedProperties: UpdateApplication = {
      title: "title",
      companyName: "foo",
      status: ApplicationStatus.Applied,
      applicationDate: new Date("2021-03-25"),
      description: null,
      annualSalary: 42000,
    };

    const application = await updateApplication(
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
