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

describe("server action - email", () => {
  it("rejects an empty email", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectInvalidField(actionState, "email", REQUIRED_FIELD);
  });

  it("rejects an invalid email", async () => {
    const formData = new FormData();
    formData.append("email", "invalid-dot-com");

    const actionState = await action(formData);

    expectInvalidField(actionState, "email", INVALID_EMAIL);
  });

  it("accepts a valid email", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");

    const actionState = await action(formData);

    expectValidField(actionState, "email", "test@example.com");
  });
});

describe("server action - password", () => {
  it("rejects an empty password", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", REQUIRED_FIELD);
  });

  it("rejects passwords with less than 13 characters", async () => {
    const formData = new FormData();
    formData.append("password", "short");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_TOO_SHORT);
  });

  it("rejects passwords without lowercase characters", async () => {
    const formData = new FormData();
    formData.append("password", "UPPER");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_LOWER);
  });

  it("rejects passwords without uppercase characters", async () => {
    const formData = new FormData();
    formData.append("password", "lower");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_UPPER);
  });

  it("rejects passwords without digits", async () => {
    const formData = new FormData();
    formData.append("password", "lowerUpP");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_DIGIT);
  });

  it("rejects passwords without special characters", async () => {
    const formData = new FormData();
    formData.append("password", "lowerUppeR12");

    const actionState = await action(formData);

    expectInvalidField(actionState, "password", PASSWORD_NO_SPECIAL);
  });

  it("aggregates errors", async () => {
    const formData = new FormData();
    formData.append("password", "fOo");

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
    const formData = new FormData();
    formData.append("password", "lowerUppeR12!");

    const actionState = await action(formData);

    expectValidField(actionState, "password", "lowerUppeR12!");
  });
});

describe("server action - confirmedPassword", () => {
  it("rejects an empty confirmedPassword", async () => {
    const formData = new FormData();

    const actionState = await action(formData);

    expectInvalidField(actionState, "confirmedPassword", REQUIRED_FIELD);
  });

  it("rejects when password and confirmedPassword are different", async () => {
    const formData = new FormData();
    formData.append("password", "input123Output!");
    formData.append("confirmedPassword", "not-input");

    const actionState = await action(formData);

    expectInvalidField(
      actionState,
      "confirmedPassword",
      PASSWORD_INVALID_MATCH,
    );
  });

  it("accepts when password and confirmedPassword are equals", async () => {
    const formData = new FormData();
    formData.append("password", "input");
    formData.append("confirmedPassword", "input");

    const actionState = await action(formData);

    expectValidField(actionState, "confirmedPassword", "input");
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
    formData.append("email", "email@example.com");
    formData.append("password", "pass2025Word!");
    formData.append("confirmedPassword", "pass2025Word!");

    let called = false;
    const onSuccess = async () => {
      called = true;
    };

    await action(formData, onSuccess);
    expect(called).toBeTruthy();
  });
});
