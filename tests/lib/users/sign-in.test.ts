import {
  INVALID_CREDENTIALS,
  REQUIRED_FIELD,
} from "@/lib/shared/error_messages";
import signIn, {
  SignInData,
  SignInError,
  SignInResult,
} from "@/lib/users/sign-in";

describe("signIn", () => {
  it("rejects a missing email", async () => {
    const formData = new FormData();

    const output = await signIn(formData, alwaysSignIn);

    expectInvalidField(output, "email", REQUIRED_FIELD);
  });

  it("rejects a blank email", async () => {
    const formData = new FormData();
    formData.set("email", "     ");

    const output = await signIn(formData, alwaysSignIn);

    expectInvalidField(output, "email", REQUIRED_FIELD);
  });

  it("rejects a missing password", async () => {
    const formData = new FormData();

    const output = await signIn(formData, alwaysSignIn);

    expectInvalidField(output, "password", REQUIRED_FIELD);
  });

  it("rejects a blank password", async () => {
    const formData = new FormData();
    formData.set("password", "   ");

    const output = await signIn(formData, alwaysSignIn);

    expectInvalidField(output, "password", REQUIRED_FIELD);
  });

  it("accepts a valid email and password", async () => {
    const formData = createValidForm();

    const output = await signIn(formData, alwaysSignIn);

    expect(output.success).toBeTruthy();
  });

  it("calls the signIn function on valid form", async () => {
    const formData = createValidForm();

    let called = false;
    const mockSignIn = async () => {
      called = true;
      return called;
    };

    const output = await signIn(formData, mockSignIn);

    expect(called).toBeTruthy();
    expect(output.success).toBeTruthy();
  });

  it("returns an error if the signInFn fails", async () => {
    const formData = createValidForm();

    const output = await signIn(formData, neverSignIn);

    expectInvalidField(output, "error", INVALID_CREDENTIALS);
  });

  it("returns a SignInSuccess if the signInFn succeeds", async () => {
    const formData = createValidForm();

    const { success, result } = await signIn(formData, alwaysSignIn);

    expect(success).toBeTruthy();
    expect(result).toMatchObject({ redirectUrl: "/applications" });
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function alwaysSignIn(_signInData: SignInData) {
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function neverSignIn(_signInData: SignInData) {
  return false;
}

function createValidForm() {
  const formData = new FormData();
  formData.set("email", "email");
  formData.set("password", "paswword");

  return formData;
}

function expectInvalidField(
  output: SignInResult,
  field: keyof SignInError,
  errorMessage: string,
) {
  const { success, result } = output;

  expect(success).toBeFalsy();

  const errors = result as SignInError;
  expect(errors[field]).toContain(errorMessage);
}
