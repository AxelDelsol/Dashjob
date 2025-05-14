import { action } from "@/lib/applications/create/internal-actions";
import { ApplicationStatus } from "@/lib/applications/definitions";
import { REQUIRED_FIELD } from "@/lib/shared/error_messages";
import {
  expectInvalidField,
  expectValidField,
} from "../../server-action-helpers";

describe("server action - valid form", () => {
  it("does not contain any errors", async () => {
    const formData = createValidFormData();

    const actionState = await action(formData);

    expect(actionState.errors).toEqual({});
  });
});

describe("server action - title", () => {
  it("rejects an empty title", async () => {
    const formData = createValidFormData();
    formData.delete("title");

    const actionState = await action(formData);

    expectInvalidField(actionState, "title", REQUIRED_FIELD);
  });

  it("rejects an empty string title", async () => {
    const formData = createValidFormData();
    formData.set("title", "");

    const actionState = await action(formData);

    expectInvalidField(actionState, "title", REQUIRED_FIELD);
  });

  it("accepts a valid title", async () => {
    const formData = createValidFormData();
    formData.append("title", "Job title");

    const actionState = await action(formData);

    expectValidField(actionState, "title", "Job title");
  });
});

describe("server action - companyName", () => {
  it("rejects an empty companyName", async () => {
    const formData = createValidFormData();
    formData.delete("companyName");

    const actionState = await action(formData);

    expectInvalidField(actionState, "companyName", REQUIRED_FIELD);
  });

  it("rejects an empty string companyName", async () => {
    const formData = createValidFormData();
    formData.set("companyName", "  ");

    const actionState = await action(formData);

    expectInvalidField(actionState, "companyName", REQUIRED_FIELD);
  });

  it("accepts a valid companyName", async () => {
    const formData = createValidFormData();
    formData.append("companyName", "Company");

    const actionState = await action(formData);

    expectValidField(actionState, "companyName", "Company");
  });
});

describe("server action - status", () => {
  it("rejects an empty status", async () => {
    const formData = createValidFormData();
    formData.delete("status");

    const actionState = await action(formData);

    expectInvalidField(actionState, "status", REQUIRED_FIELD);
  });

  it("accepts a valid status", async () => {
    const formData = createValidFormData();
    formData.append("status", "applied");

    const actionState = await action(formData);

    expectValidField(actionState, "status", ApplicationStatus.Applied);
  });
});

describe("server action - applicationDate", () => {
  it("rejects an empty applicationDate", async () => {
    const formData = createValidFormData();
    formData.delete("applicationDate");

    const actionState = await action(formData);

    expectInvalidField(actionState, "applicationDate", REQUIRED_FIELD);
  });

  it("accepts a valid applicationDate", async () => {
    const formData = createValidFormData();
    formData.set("applicationDate", "2025-05-12");

    const actionState = await action(formData);

    expectValidField(actionState, "applicationDate", "2025-05-12");
  });
});

describe("server action - description", () => {
  it("accepts an empty description", async () => {
    const formData = createValidFormData();
    formData.delete("description");

    const actionState = await action(formData);

    expectValidField(actionState, "description", undefined);
  });

  it("converts empty string to undefined", async () => {
    const formData = createValidFormData();
    formData.set("description", "");

    const actionState = await action(formData);

    expectValidField(actionState, "description", undefined);
  });

  it("accepts a valid description", async () => {
    const formData = createValidFormData();
    formData.set("description", "Description");

    const actionState = await action(formData);

    expectValidField(actionState, "description", "Description");
  });
});

describe("server action - annualSalary", () => {
  it("accepts an undefined annualSalary", async () => {
    const formData = createValidFormData();
    formData.delete("annualSalary");

    const actionState = await action(formData);

    expectValidField(actionState, "annualSalary", undefined);
  });

  it("converts empty string to undefined", async () => {
    const formData = createValidFormData();
    formData.set("annualSalary", "");

    const actionState = await action(formData);

    expectValidField(actionState, "annualSalary", undefined);
  });

  it("accepts a valid annualSalary", async () => {
    const formData = createValidFormData();
    formData.append("annualSalary", "42000");

    const actionState = await action(formData);

    expectValidField(actionState, "annualSalary", 42000);
  });
});

function createValidFormData() {
  const formData = new FormData();
  formData.append("title", "Job title");
  formData.append("companyName", "Company");
  formData.append("status", "applied");
  formData.append("applicationDate", "2025-05-12");
  formData.append("description", "Description");
  formData.append("annualSalary", "42000");

  return formData;
}
