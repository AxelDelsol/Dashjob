"use server";

import { signIn as authSignIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import signIn, { SignInData, SignInError } from "./sign-in";

export type SignInActionState = {
  data: {
    [k: string]: FormDataEntryValue;
  };
  errors: SignInError;
};

export async function signInAction(
  _prevState: SignInActionState,
  formData: FormData,
) {
  const signInUser = async (signInData: SignInData) => {
    try {
      await authSignIn("credentials", {
        email: signInData.email,
        password: signInData.password,
        redirect: false,
      });

      return true;
    } catch (error) {
      if (error instanceof AuthError) {
        return false;
      }

      throw error;
    }
  };

  const { success, result } = await signIn(formData, signInUser);

  if (success) {
    redirect(result.redirectUrl);
  } else {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: result,
    };
  }
}
