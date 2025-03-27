"use server";

import {
  INVALID_FORM,
  INVALID_PASSWORD,
  UNKNOWN_EMAIL,
  UNKNOWN_ERROR,
  USER_NOT_VALIDATED,
} from "@/lib/error_messages";
import { SignInSchema } from "@/lib/schemas";
import { comparePasswords, getUserByEmail } from "@/lib/users";
import { redirect } from "next/navigation";
import { signIn } from "../../auth";

export type SignInError = {
  message?: string;
  errors?: {
    email?: string | string[];
    password?: string | string[];
  };
};

export async function signInAction(prevState: SignInError, formData: FormData) {
  const validatedFields = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: INVALID_FORM,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      message: INVALID_FORM,
      errors: { email: UNKNOWN_EMAIL },
    };
  }

  if (!(user.status === "validated")) {
    return {
      message: INVALID_FORM,
      errors: { email: USER_NOT_VALIDATED },
    };
  }

  if (!comparePasswords(password, user.hashed_password)) {
    return {
      message: INVALID_FORM,
      errors: { password: INVALID_PASSWORD },
    };
  }

  try {
    await signIn("credentials", {
      email: email,
      user_id: user.id,
      redirect: false,
    });
  } catch {
    return {
      message: UNKNOWN_ERROR,
    };
  }

  redirect("/applications");
}
