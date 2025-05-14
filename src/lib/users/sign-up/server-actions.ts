"use server";

import { z } from "zod";

import { UNIQUE_VIOLATION } from "@/lib/shared/db";
import {
  EMAIL_ALREADY_TAKEN,
  INVALID_EMAIL,
  PASSWORD_INVALID_MATCH,
  PASSWORD_NO_DIGIT,
  PASSWORD_NO_LOWER,
  PASSWORD_NO_SPECIAL,
  PASSWORD_NO_UPPER,
  PASSWORD_TOO_SHORT,
} from "@/lib/shared/error_messages";
import {
  ActionState,
  containsErrors,
  serverAction,
} from "@/lib/shared/server-action";
import { nonEmptyString } from "@/lib/shared/zod-types";
import { redirect } from "next/navigation";
import postgres from "postgres";
import createUser from "../create-user";
import { UserStatus } from "../definitions";

const EmailSchema = z.object({
  email: nonEmptyString.pipe(z.string().email({ message: INVALID_EMAIL })),
});
const PasswordSchema = z
  .object({
    password: nonEmptyString.superRefine((val, ctx) =>
      validatePassword(val, ctx),
    ),
    confirmedPassword: nonEmptyString,
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: PASSWORD_INVALID_MATCH,
    path: ["confirmedPassword"],
  });

const SignUpSchema = z.intersection(EmailSchema, PasswordSchema);

export type SignUpData = z.infer<typeof SignUpSchema>;
export type SignUpActionState = ActionState<SignUpData>;

export async function signUpAction(
  prevState: SignUpActionState,
  formData: FormData,
) {
  const newActionState = await action(formData, signUpUser);

  if (containsErrors(newActionState)) {
    return newActionState;
  }

  redirect("/signup/notice");
}

export async function action(
  formData: FormData,
  onSuccess?: (
    newActionState: SignUpActionState,
    data: SignUpData,
  ) => Promise<void>,
) {
  return serverAction(SignUpSchema, formData, onSuccess);
}

async function signUpUser(newActionState: SignUpActionState, data: SignUpData) {
  try {
    await createUser({
      email: data.email,
      password: data.password,
      status: UserStatus.Pending,
    });
  } catch (error) {
    if (
      error instanceof postgres.PostgresError &&
      error.code === UNIQUE_VIOLATION
    ) {
      newActionState.data = {};
      newActionState.errors.email = [EMAIL_ALREADY_TAKEN];
    } else {
      throw error;
    }
  }
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
