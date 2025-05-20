import { Application } from "@/lib/applications/applications";
import updateApplication, {
  UpdateApplicationData,
  UpdateApplicationError,
  UpdateApplicationResult,
} from "@/lib/applications/update-application";
import { REQUIRED_FIELD } from "@/lib/shared/error_messages";

describe("updateApplication", () => {
  it("rejects an empty title", async () => {
    const formData = new FormData();

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "title", REQUIRED_FIELD);
  });

  it("rejects an empty string title", async () => {
    const formData = new FormData();
    formData.set("title", "");

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "title", REQUIRED_FIELD);
  });

  it("rejects an empty companyName", async () => {
    const formData = new FormData();

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "companyName", REQUIRED_FIELD);
  });

  it("rejects an empty string companyName", async () => {
    const formData = new FormData();
    formData.set("companyName", "  ");

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "companyName", REQUIRED_FIELD);
  });

  it("rejects an empty status", async () => {
    const formData = new FormData();

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "status", REQUIRED_FIELD);
  });

  it("rejects an empty applicationDate", async () => {
    const formData = new FormData();

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "applicationDate", REQUIRED_FIELD);
  });

  it("rejects an empty description", async () => {
    const formData = new FormData();

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "description", REQUIRED_FIELD);
  });

  it("rejects an empty annualSalary", async () => {
    const formData = new FormData();

    const output = await updateApplication(formData, alwaysUpdateApplication);

    expectInvalidField(output, "annualSalary", REQUIRED_FIELD);
  });

  it("calls the updateApplicationFn function on valid form", async () => {
    const formData = createValidForm();

    let called = false;
    const mockSignUp = async (data: UpdateApplicationData) => {
      called = true;
      return alwaysUpdateApplication(data);
    };

    const output = await updateApplication(formData, mockSignUp);

    expect(called).toBeTruthy();
    expect(output.success).toBeTruthy();
  });

  it("returns a UpdateApplicationSuccess", async () => {
    const formData = createValidForm();

    const { success, result } = await updateApplication(
      formData,
      alwaysUpdateApplication,
    );

    expect(success).toBeTruthy();
    expect(result).toMatchObject({
      redirectUrl: "/applications",
      revalidatePath: "/applications",
    });
  });
});

async function alwaysUpdateApplication(
  data: UpdateApplicationData,
): Promise<Application | undefined> {
  return {
    id: 2,
    userId: 1,
    ...data,
    applicationDate: new Date(data.applicationDate),
    description: data.description || undefined,
    annualSalary: data.annualSalary || undefined,
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
  output: UpdateApplicationResult,
  field: keyof UpdateApplicationError,
  errorMessage: string,
) {
  const { success, result } = output;

  expect(success).toBeFalsy();

  const errors = result as UpdateApplicationError;
  expect(errors[field]).toContain(errorMessage);
}
