import {
  INVALID_EMAIL,
  PASSWORD_INVALID_MATCH,
  PASSWORD_NO_DIGIT,
  PASSWORD_NO_LOWER,
  PASSWORD_NO_SPECIAL,
  PASSWORD_NO_UPPER,
  PASSWORD_TOO_SHORT,
  UserCreate,
} from "@/lib/users";
import { z } from "zod";

describe("UserCreate schema", () => {
  it("rejects invalid emails", () => {
    const data = { email: "invalid-xample.com" };

    expect_invalid_field(UserCreate, data, "email", INVALID_EMAIL);
  });

  it("rejects password with less than 13 characters", () => {
    const data = { password: "short" };

    expect_invalid_field(UserCreate, data, "password", PASSWORD_TOO_SHORT);
  });

  it("rejects password without lowercase characters", () => {
    const data = { password: "UPPER" };

    expect_invalid_field(UserCreate, data, "password", PASSWORD_NO_LOWER);
  });

  it("rejects password without uppercase characters", () => {
    const data = { password: "lower" };

    expect_invalid_field(UserCreate, data, "password", PASSWORD_NO_UPPER);
  });

  it("rejects password without digits", () => {
    const data = { password: "lowerUpP" };

    expect_invalid_field(UserCreate, data, "password", PASSWORD_NO_DIGIT);
  });

  it("rejects password without special characters", () => {
    const data = { password: "lowerUppeR12" };

    expect_invalid_field(UserCreate, data, "password", PASSWORD_NO_SPECIAL);
  });

  it("accepts complex passwords", () => {
    const data = { password: "lowerUppeR12!" };

    const validatedData = UserCreate.safeParse(data);

    const errors = validatedData.error!.flatten().fieldErrors!;
    expect(errors["password"]).toBeUndefined();
  });

  it("rejects when password and confirmedPassword are differents", () => {
    const data = {
      email: "test@example.com",
      password: "lower",
      confirmedPassword: "bar",
    };

    expect_invalid_field(
      UserCreate,
      data,
      "confirmedPassword",
      PASSWORD_INVALID_MATCH,
    );
  });

  it("accepts valid inputs", () => {
    const data = {
      email: "test@example.com",
      password: "2XH$F9n*^NsB$M0",
      confirmedPassword: "2XH$F9n*^NsB$M0",
    };

    const validatedData = UserCreate.safeParse(data);
    expect(validatedData.success).toBeTruthy();
  });
});

function expect_invalid_field(
  schema: z.ZodTypeAny,
  data: object,
  error_field: string,
  error_message: string,
) {
  const validatedData = schema.safeParse(data);
  expect(validatedData.success).toBeFalsy();

  const errors = validatedData.error!.flatten().fieldErrors!;
  expect(errors[error_field]).toContain(error_message);
}
