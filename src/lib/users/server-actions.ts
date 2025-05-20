"use server";

import { signIn as authSignIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import signIn, { SignInData, SignInError } from "./sign-in";
import signUp, { SignUpData, SignUpError } from "./sign-up";
import { createUser, UserStatus } from "./users";

type ActionState<E> = {
  data: {
    [k: string]: FormDataEntryValue;
  };
  errors: E;
};

export type SignInActionState = ActionState<SignInError>;

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

export type SignUpActionState = ActionState<SignUpError>;
export async function signUpAction(
  _prevState: SignUpActionState,
  formData: FormData,
) {
  const signUpUser = async (signUpData: SignUpData) => {
    return createUser({
      email: signUpData.email,
      password: signUpData.password,
      status: UserStatus.Pending,
    });
  };

  const { success, result } = await signUp(formData, signUpUser);

  if (success) {
    redirect(result.redirectUrl);
  } else {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: result,
    };
  }
}
