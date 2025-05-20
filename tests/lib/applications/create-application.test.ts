import { Application } from "@/lib/applications/applications";
import createApplication, {
  CreateApplicationData,
  CreateApplicationError,
  CreateApplicationResult,
} from "@/lib/applications/create-application";
import { REQUIRED_FIELD } from "@/lib/shared/error_messages";

describe("createApplication", () => {
  it("rejects an empty title", async () => {
    const userId = 1;
    const formData = new FormData();

    const output = await createApplication(
      userId,
      formData,
      alwaysCreateApplication,
    );

    expectInvalidField(output, "title", REQUIRED_FIELD);
  });

  it("rejects an empty string title", async () => {
    const userId = 1;
    const formData = new FormData();
    formData.set("title", "");

    const output = await createApplication(
      userId,
      formData,
      alwaysCreateApplication,
    );

    expectInvalidField(output, "title", REQUIRED_FIELD);
  });

  it("rejects an empty companyName", async () => {
    const userId = 1;
    const formData = new FormData();

    const output = await createApplication(
      userId,
      formData,
      alwaysCreateApplication,
    );

    expectInvalidField(output, "companyName", REQUIRED_FIELD);
  });

  it("rejects an empty string companyName", async () => {
    const userId = 1;
    const formData = new FormData();
    formData.set("companyName", "");

    const output = await createApplication(
      userId,
      formData,
      alwaysCreateApplication,
    );

    expectInvalidField(output, "companyName", REQUIRED_FIELD);
  });

  it("rejects an empty status", async () => {
    const userId = 1;
    const formData = new FormData();

    const output = await createApplication(
      userId,
      formData,
      alwaysCreateApplication,
    );

    expectInvalidField(output, "status", REQUIRED_FIELD);
  });

  it("rejects an empty applicationDate", async () => {
    const userId = 1;
    const formData = new FormData();

    const output = await createApplication(
      userId,
      formData,
      alwaysCreateApplication,
    );

    expectInvalidField(output, "applicationDate", REQUIRED_FIELD);
  });

  it("calls the createApplicationFn function on valid form", async () => {
    const userId = 1;
    const formData = createValidForm();

    let called = false;
    const mockSignUp = async (userId: number, data: CreateApplicationData) => {
      called = true;
      return alwaysCreateApplication(userId, data);
    };

    const output = await createApplication(userId, formData, mockSignUp);

    expect(called).toBeTruthy();
    expect(output.success).toBeTruthy();
  });

  it("returns a CreateApplicationSuccess", async () => {
    const userId = 1;
    const formData = createValidForm();

    const { success, result } = await createApplication(
      userId,
      formData,
      alwaysCreateApplication,
    );

    expect(success).toBeTruthy();
    expect(result).toMatchObject({
      redirectUrl: "/applications",
      revalidatePath: "/applications",
    });
  });
});

async function alwaysCreateApplication(
  userId: number,
  data: CreateApplicationData,
): Promise<Application> {
  return {
    id: 2,
    userId,
    ...data,
    applicationDate: new Date(data.applicationDate),
  };
}

function createValidForm() {
  const formData = new FormData();
  formData.append("title", "Job title");
  formData.append("companyName", "Company");
  formData.append("status", "applied");
  formData.append("applicationDate", "2025-05-12");
  formData.append("description", "Description");
  formData.append("annualSalary", "42000");

  return formData;
}

function expectInvalidField(
  output: CreateApplicationResult,
  field: keyof CreateApplicationError,
  errorMessage: string,
) {
  const { success, result } = output;

  expect(success).toBeFalsy();

  const errors = result as CreateApplicationError;
  expect(errors[field]).toContain(errorMessage);
}
