import {
  INVALID_EMAIL,
  PASSWORD_INVALID_MATCH,
  PASSWORD_NO_DIGIT,
  PASSWORD_NO_LOWER,
  PASSWORD_NO_SPECIAL,
  PASSWORD_NO_UPPER,
  PASSWORD_TOO_SHORT,
  REQUIRED_FIELD,
  SIGN_UP_ERROR,
} from "@/lib/shared/error_messages";
import signUp, {
  SignUpData,
  SignUpError,
  SignUpResult,
} from "@/lib/users/sign-up";
import { User, UserStatus } from "@/lib/users/users";

describe("signUp", () => {
  it("rejects a missing email", async () => {
    const formData = new FormData();

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "email", REQUIRED_FIELD);
  });

  it("rejects an invalid email", async () => {
    const formData = createValidForm();
    formData.set("email", "invalid");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "email", INVALID_EMAIL);
  });

  it("rejects an empty password", async () => {
    const formData = createValidForm();
    formData.delete("password");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "password", REQUIRED_FIELD);
  });

  it("rejects passwords with less than 13 characters", async () => {
    const formData = createValidForm("short");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "password", PASSWORD_TOO_SHORT);
  });

  it("rejects passwords without lowercase characters", async () => {
    const formData = createValidForm("UPPER");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "password", PASSWORD_NO_LOWER);
  });

  it("rejects passwords without uppercase characters", async () => {
    const formData = createValidForm("lower");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "password", PASSWORD_NO_UPPER);
  });

  it("rejects passwords without digits", async () => {
    const formData = createValidForm("lowerUpP");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "password", PASSWORD_NO_DIGIT);
  });

  it("rejects passwords without special characters", async () => {
    const formData = createValidForm("lowerUppeR12");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "password", PASSWORD_NO_SPECIAL);
  });

  it("aggregates errors", async () => {
    const formData = createValidForm("fOo");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(
      output,
      "password",
      PASSWORD_TOO_SHORT,
      PASSWORD_NO_DIGIT,
      PASSWORD_NO_SPECIAL,
    );
  });

  it("rejects an empty confirmedPassword", async () => {
    const formData = createValidForm();
    formData.delete("confirmedPassword");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "confirmedPassword", REQUIRED_FIELD);
  });

  it("rejects when password and confirmedPassword are different", async () => {
    const formData = createValidForm();
    formData.set("confirmedPassword", formData.get("password") + "not-input");

    const output = await signUp(formData, alwaysSignUp);

    expectInvalidField(output, "confirmedPassword", PASSWORD_INVALID_MATCH);
  });

  it("calls the signUp function on valid form", async () => {
    const formData = createValidForm();

    let called = false;
    const mockSignUp = async () => {
      called = true;
      return {
        id: 1,
        email: "email",
        hashedPassword: "password",
        status: UserStatus.Validated,
      };
    };

    const output = await signUp(formData, mockSignUp);

    expect(called).toBeTruthy();
    expect(output.success).toBeTruthy();
  });

  it("returns an error if the signInFn fails", async () => {
    const formData = createValidForm();

    const output = await signUp(formData, neverSignUp);

    expectInvalidField(output, "email", SIGN_UP_ERROR);
  });

  it("returns a SignUpSuccess if the signUpFn succeeds", async () => {
    const formData = createValidForm();

    const { success, result } = await signUp(formData, alwaysSignUp);

    expect(success).toBeTruthy();
    expect(result).toMatchObject({ redirectUrl: "/signup/notice" });
  });
});

async function alwaysSignUp(signUpData: SignUpData): Promise<User> {
  return {
    id: 1,
    email: signUpData.email,
    hashedPassword: signUpData.password,
    status: UserStatus.Validated,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function neverSignUp(_signInData: SignUpData) {
  return undefined;
}

function createValidForm(password?: string) {
  const formData = new FormData();
  formData.set("email", "email@example.com");
  formData.set("password", password || "pass2025Word!");
  formData.set("confirmedPassword", password || "pass2025Word!");

  return formData;
}

function expectInvalidField(
  output: SignUpResult,
  field: keyof SignUpError,
  ...errorMessages: string[]
) {
  const { success, result } = output;

  expect(success).toBeFalsy();

  const errors = result as SignUpError;
  for (const errorMessage of errorMessages) {
    expect(errors[field]).toContain(errorMessage);
  }
}
