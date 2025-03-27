"use server";

import { redirect } from "next/navigation";
import postgres from "postgres";

import { UNIQUE_VIOLATION } from "@/lib/db";
import {
  EMAIL_ALREADY_TAKEN,
  INVALID_FORM,
  UNKNOWN_ERROR,
} from "@/lib/error_messages";
import { UserCreate } from "@/lib/schemas";
import { createUser } from "@/lib/users";

export type SignUpError = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    confirmedPassword?: string[];
  };
};

export async function signUpAction(prevState: SignUpError, formData: FormData) {
  const validatedFields = UserCreate.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmedPassword: formData.get("confirmedPassword"),
  });

  if (!validatedFields.success) {
    return {
      message: INVALID_FORM,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await createUser(validatedFields.data.email, validatedFields.data.password);
  } catch (error) {
    if (
      error instanceof postgres.PostgresError &&
      error.code === UNIQUE_VIOLATION
    ) {
      return {
        message: INVALID_FORM,
        errors: { email: [EMAIL_ALREADY_TAKEN] },
      };
    } else {
      return {
        message: UNKNOWN_ERROR,
      };
    }
  }

  redirect("/signup/notice");
}
