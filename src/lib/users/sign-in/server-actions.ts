"use server";

import { signIn } from "@/auth";
import { INVALID_CREDENTIALS } from "@/lib/shared/error_messages";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function signInAction(prevState: string, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email")?.toString(),
      password: formData.get("password")?.toString(),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return INVALID_CREDENTIALS;
    }

    throw error;
  }

  redirect("/applications");
}
