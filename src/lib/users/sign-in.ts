import { z } from "zod";
import { INVALID_CREDENTIALS } from "../shared/error_messages";
import { failure, Result, success } from "../shared/result";
import { nonEmptyString } from "../shared/zod-types";

const SignInSchema = z.object({
  email: nonEmptyString,
  password: nonEmptyString,
});

export type SignInData = z.infer<typeof SignInSchema>;

export type SignInError = {
  [K in keyof SignInData]?: string[];
} & { error?: string };

export type SignInSuccess = {
  redirectUrl: string;
};

export type SignInResult = Result<SignInSuccess, SignInError>;

export default async function signIn(
  formData: FormData,
  signInFn: (signInData: SignInData) => Promise<boolean>,
): Promise<SignInResult> {
  const data = Object.fromEntries(formData.entries());
  const result = SignInSchema.safeParse(data);

  if (!result.success) {
    return failure(result.error.flatten().fieldErrors);
  }

  const signedIn = await signInFn(result.data);
  if (!signedIn) {
    return failure({ error: INVALID_CREDENTIALS });
  }

  return success({ redirectUrl: "/applications" });
}
