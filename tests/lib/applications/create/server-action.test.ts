import { action } from "@/lib/applications/create/internal-actions";
import { ApplicationStatus } from "@/lib/applications/definitions";
import { REQUIRED_FIELD } from "@/lib/shared/error_messages";
import {
  expectInvalidField,
  expectValidField,
} from "../../server-action-helpers";

describe("server action - title", () => {
  it("rejects an empty title", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectInvalidField(actionState, "title", REQUIRED_FIELD);
  });

  it("accepts a valid title", async () => {
    const formData = new FormData();
    formData.append("title", "Job title");

    const actionState = await action(formData);

    expectValidField(actionState, "title", "Job title");
  });
});

describe("server action - companyName", () => {
  it("rejects an empty companyName", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectInvalidField(actionState, "companyName", REQUIRED_FIELD);
  });

  it("accepts a valid companyName", async () => {
    const formData = new FormData();
    formData.append("companyName", "Company");

    const actionState = await action(formData);

    expectValidField(actionState, "companyName", "Company");
  });
});

describe("server action - status", () => {
  it("rejects an empty status", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectInvalidField(actionState, "status", REQUIRED_FIELD);
  });

  it("accepts a valid status", async () => {
    const formData = new FormData();
    formData.append("status", "applied");

    const actionState = await action(formData);

    expectValidField(actionState, "status", ApplicationStatus.Applied);
  });
});

describe("server action - applicationDate", () => {
  it("rejects an empty applicationDate", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectInvalidField(actionState, "applicationDate", REQUIRED_FIELD);
  });

  it("accepts a valid applicationDate", async () => {
    const formData = new FormData();
    formData.append("applicationDate", "2025-05-12");

    const actionState = await action(formData);

    expectValidField(actionState, "applicationDate", "2025-05-12");
  });
});

describe("server action - description", () => {
  it("accepts an empty description", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectValidField(actionState, "description", undefined);
  });

  it("accepts a valid description", async () => {
    const formData = new FormData();
    formData.append("description", "Description");

    const actionState = await action(formData);

    expectValidField(actionState, "description", "Description");
  });
});

describe("server action - annualSalary", () => {
  it("accepts an undefined annualSalary", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectValidField(actionState, "annualSalary", undefined);
  });

  it("accepts an empty annualSalary", async () => {
    const formData = new FormData();
    formData.append("annualSalary", "");

    const actionState = await action(formData);

    expectValidField(actionState, "annualSalary", "");
  });

  it("accepts a valid annualSalary", async () => {
    const formData = new FormData();
    formData.append("annualSalary", "42000");

    const actionState = await action(formData);

    expectValidField(actionState, "annualSalary", "42000");
  });
});

describe("server action - callback", () => {
  it("does not call the callback on failure", async () => {
    const formData = new FormData();

    let called = false;
    const onSuccess = async () => {
      called = true;
    };

    await action(formData, onSuccess);
    expect(called).toBeFalsy();
  });

  it("calls the callback on success", async () => {
    const formData = new FormData();
    formData.append("title", "Job title");
    formData.append("companyName", "Company");
    formData.append("status", "applied");
    formData.append("applicationDate", "2025-05-12");
    formData.append("description", "Description");
    formData.append("annualSalary", "42000");

    let called = false;
    const onSuccess = async () => {
      called = true;
    };

    await action(formData, onSuccess);
    expect(called).toBeTruthy();
  });
});
