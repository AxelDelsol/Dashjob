import { z } from "zod";

export const REQUIRED_FIELD = 'Le champ est obligatoire'
export const INVALID_EMAIL = "L'adresse email invalide";
export const PASSWORD_TOO_SHORT = 'Le mot de passe doit contenir au moins 13 caractères';
export const PASSWORD_NO_LOWER = 'Le mot de passe doit contenir au moins une lettre minuscule';
export const PASSWORD_NO_UPPER = 'Le mot de passe doit contenir au moins une lettre majuscule';
export const PASSWORD_NO_DIGIT = 'Le mot de passe doit contenir au moins un chiffre'
export const PASSWORD_NO_SPECIAL = 'Le mot de passe doit contenir au moins un caractère spécial (exemple: ! @ # $ % ^ & * ( ) .)'
export const PASSWORD_INVALID_MATCH = 'Les mots de passe sont différents'

const requiredString = z.string({ message: REQUIRED_FIELD})

export const UserCreate = z.object({
  email: requiredString
          .email({ message: INVALID_EMAIL }),
  password: requiredString
              .min(13, {message: PASSWORD_TOO_SHORT})
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
  confirmedPassword: requiredString
}).superRefine(({ confirmedPassword, password }, ctx) => {
  if (confirmedPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PASSWORD_INVALID_MATCH,
      path: ['confirmedPassword']
    });
  }
});