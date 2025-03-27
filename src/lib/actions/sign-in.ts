"use server";

import { INVALID_CREDENTIALS, UNKNOWN_ERROR } from "@/lib/error_messages";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "../../auth";

export async function signInAction(prevState: string, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return INVALID_CREDENTIALS;
    }

    return UNKNOWN_ERROR;
  }

  redirect("/applications");
}
