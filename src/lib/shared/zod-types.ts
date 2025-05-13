import { z } from "zod";
import { REQUIRED_FIELD } from "./error_messages";

export const optionalNonEmptyString = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }
    const trimmed = value.trim();

    return trimmed ? trimmed : undefined;
  });

export const nonEmptyString = z
  .string({ required_error: REQUIRED_FIELD })
  .transform((val, ctx) => {
    const trimmedVal = val.trim();

    if (!trimmedVal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: REQUIRED_FIELD,
      });

      return z.NEVER;
    }

    return trimmedVal;
  });
