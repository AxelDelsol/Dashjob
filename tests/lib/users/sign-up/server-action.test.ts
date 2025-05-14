import {
  INVALID_EMAIL,
  PASSWORD_INVALID_MATCH,
  PASSWORD_NO_DIGIT,
  PASSWORD_NO_LOWER,
  PASSWORD_NO_SPECIAL,
  PASSWORD_NO_UPPER,
  PASSWORD_TOO_SHORT,
  REQUIRED_FIELD,
} from "@/lib/shared/error_messages";
import { action } from "@/lib/users/sign-up/server-actions";
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

describe("server action - email", () => {
  it("rejects an empty email", async () => {
    const formData = createValidFormData();
    formData.delete("email");

    const actionState = await action(formData);

    expectInvalidField(actionState, "email", REQUIRED_FIELD);
  });

  it("rejects an invalid email", async () => {
    const formData = createValidFormData();
    formData.set("email", "invalid-dot-com");

    const actionState = await action(formData);

    expectInvalidField(actionState, "email", INVALID_EMAIL);
  });

  it("accepts a valid email", async () => {
    const formData = createValidFormData();
    formData.set("email", "test@example.com");

    const actionState = await action(formData);

    expectValidField(actionState, "email", "test@example.com");
  });
});

describe("server action - password", () => {
  it("rejects an empty password", async () => {
    const formData = createValidFormData();
    formData.delete("password");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", REQUIRED_FIELD);
  });

  it("rejects passwords with less than 13 characters", async () => {
    const formData = createValidFormData("short");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_TOO_SHORT);
  });

  it("rejects passwords without lowercase characters", async () => {
    const formData = createValidFormData("UPPER");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_LOWER);
  });

  it("rejects passwords without uppercase characters", async () => {
    const formData = createValidFormData("lower");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_UPPER);
  });

  it("rejects passwords without digits", async () => {
    const formData = createValidFormData("lowerUpP");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_DIGIT);
  });

  it("rejects passwords without special characters", async () => {
    const formData = createValidFormData("lowerUppeR12");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_SPECIAL);
  });

  it("aggregates errors", async () => {
    const formData = createValidFormData("fOo");

    const actionState = await action(formData);

    expectInvalidField(
      actionState,
      "password",
      PASSWORD_TOO_SHORT,
      PASSWORD_NO_DIGIT,
      PASSWORD_NO_SPECIAL,
    );
  });

  it("accepts complex passwords", async () => {
    const formData = createValidFormData("lowerUppeR12!");

    const actionState = await action(formData);

    expectValidField(actionState, "password", "lowerUppeR12!");
  });
});

describe("server action - confirmedPassword", () => {
  it("rejects an empty confirmedPassword", async () => {
    const formData = createValidFormData();
    formData.delete("confirmedPassword");

    const actionState = await action(formData);

    expectInvalidField(actionState, "confirmedPassword", REQUIRED_FIELD);
  });

  it("rejects when password and confirmedPassword are different", async () => {
    const formData = createValidFormData();
    formData.set("confirmedPassword", formData.get("password") + "not-input");

    const actionState = await action(formData);

    expectInvalidField(
      actionState,
      "confirmedPassword",
      PASSWORD_INVALID_MATCH,
    );
  });

  it("accepts when password and confirmedPassword are equals", async () => {
    const formData = createValidFormData();
    const password = formData.get("password");
    formData.set("password", password + "foo");
    formData.set("confirmedPassword", password + "foo");

    const actionState = await action(formData);

    expectValidField(actionState, "confirmedPassword", password + "foo");
  });
});

function createValidFormData(password?: string) {
  const formData = new FormData();
  formData.set("email", "email@example.com");
  formData.set("password", password || "pass2025Word!");
  formData.set("confirmedPassword", password || "pass2025Word!");

  return formData;
}
