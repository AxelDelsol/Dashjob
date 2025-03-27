import {
  INVALID_EMAIL,
  PASSWORD_INVALID_MATCH,
  PASSWORD_NO_DIGIT,
  PASSWORD_NO_LOWER,
  PASSWORD_NO_SPECIAL,
  PASSWORD_NO_UPPER,
  PASSWORD_TOO_SHORT,
  REQUIRED_FIELD,
} from "@/lib/error_messages";
import { z } from "zod";

export const requiredString = z.string({ message: REQUIRED_FIELD });

export const UserCreate = z
  .object({
    email: requiredString.email({ message: INVALID_EMAIL }),
    password: requiredString
      .min(13, { message: PASSWORD_TOO_SHORT })
      .superRefine((val, ctx) => {
        if (!/[a-z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PASSWORD_NO_LOWER,
          });
        }

        if (!/[A-Z]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PASSWORD_NO_UPPER,
          });
        }

        if (!/[0-9]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PASSWORD_NO_DIGIT,
          });
        }

        if (!/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: PASSWORD_NO_SPECIAL,
          });
        }
      }),
    confirmedPassword: requiredString,
  })
  .superRefine(({ confirmedPassword, password }, ctx) => {
    if (confirmedPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PASSWORD_INVALID_MATCH,
        path: ["confirmedPassword"],
      });
    }
  });

export const SignInSchema = z.object({
  email: requiredString.email({ message: INVALID_EMAIL }),
  password: requiredString,
});
