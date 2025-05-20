import { z } from "zod";
import {
  INVALID_EMAIL,
  PASSWORD_INVALID_MATCH,
  PASSWORD_NO_DIGIT,
  PASSWORD_NO_LOWER,
  PASSWORD_NO_SPECIAL,
  PASSWORD_NO_UPPER,
  PASSWORD_TOO_SHORT,
  SIGN_UP_ERROR,
} from "../shared/error_messages";
import { failure, Result, success } from "../shared/result";
import { nonEmptyString } from "../shared/zod-types";
import { User } from "./users";

const SignUpSchema = z
  .object({
    email: nonEmptyString.pipe(z.string().email({ message: INVALID_EMAIL })),
    password: nonEmptyString.superRefine((val, ctx) =>
      validatePassword(val, ctx),
    ),
    confirmedPassword: nonEmptyString,
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: PASSWORD_INVALID_MATCH,
    path: ["confirmedPassword"],
  });

export type SignUpData = z.infer<typeof SignUpSchema>;

export type SignUpError = {
  [K in keyof SignUpData]?: string[];
};

export type SignUpSuccess = {
  redirectUrl: string;
};

export type SignUpResult = Result<SignUpSuccess, SignUpError>;

export default async function signUp(
  formData: FormData,
  signUpFn: (signInData: SignUpData) => Promise<User | undefined>,
): Promise<SignUpResult> {
  const data = Object.fromEntries(formData.entries());
  const result = SignUpSchema.safeParse(data);

  if (!result.success) {
    return failure(result.error.flatten().fieldErrors);
  }
  const user = await signUpFn(result.data);
  if (!user) {
    return failure({ email: [SIGN_UP_ERROR] });
  }

  return success({ redirectUrl: "/signup/notice" });
}

const MIN_PASSWORD_LENGTH = 13;
const LOWER_REGEX = /[a-z]/;
const UPPER_REGEX = /[A-Z]/;
const DIGIT_REGEX = /[0-9]/;
const SPECIAL_REGEX = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;
const validations: Array<{
  validTest: (input: string) => boolean;
  errorMessage: string;
}> = [
  {
    validTest: (password) => password.length >= MIN_PASSWORD_LENGTH,
    errorMessage: PASSWORD_TOO_SHORT,
  },
  {
    validTest: (password) => LOWER_REGEX.test(password),
    errorMessage: PASSWORD_NO_LOWER,
  },
  {
    validTest: (password) => UPPER_REGEX.test(password),
    errorMessage: PASSWORD_NO_UPPER,
  },
  {
    validTest: (password: string) => DIGIT_REGEX.test(password),
    errorMessage: PASSWORD_NO_DIGIT,
  },
  {
    validTest: (password: string) => SPECIAL_REGEX.test(password),
    errorMessage: PASSWORD_NO_SPECIAL,
  },
];
function validatePassword(val: string, ctx: z.RefinementCtx) {
  for (const validationEntry of validations) {
    if (!validationEntry.validTest(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationEntry.errorMessage,
      });
    }
  }
}
