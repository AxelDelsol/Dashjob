import bcrypt from "bcryptjs";
import { z } from "zod";
import sql from "./db";
import { User } from "./definitions";

export const REQUIRED_FIELD = "Le champ est obligatoire";
export const INVALID_EMAIL = "L'adresse email invalide";
export const EMAIL_ALREADY_TAKEN = "L'adresse email existe déjà";
export const PASSWORD_TOO_SHORT =
  "Le mot de passe doit contenir au moins 13 caractères";
export const PASSWORD_NO_LOWER =
  "Le mot de passe doit contenir au moins une lettre minuscule";
export const PASSWORD_NO_UPPER =
  "Le mot de passe doit contenir au moins une lettre majuscule";
export const PASSWORD_NO_DIGIT =
  "Le mot de passe doit contenir au moins un chiffre";
export const PASSWORD_NO_SPECIAL =
  "Le mot de passe doit contenir au moins un caractère spécial (exemple: ! @ # $ % ^ & * ( ) .)";
export const PASSWORD_INVALID_MATCH = "Les mots de passe sont différents";

const requiredString = z.string({ message: REQUIRED_FIELD });

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

export async function createUser(
  email: string,
  password: string,
  status: string = "pending",
) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  await sql`
  INSERT INTO users (email, hashed_password, status)
  VALUES (${email}, ${hashedPassword}, ${status})
  `;
}

// const user: User = await getUserByEmail(email);
// bcrypt.compareSync(password, user.hashed_password)

export async function getUserByEmail(email: string) {
  const data = await sql<User[]>`
      SELECT
        users.id,
        users.email,
        users.hashed_password,
        users.status
      FROM users
      WHERE users.email = ${email}`;

  return data[0];
}

export function comparePasswords(password: string, hashed_password: string) {
  return bcrypt.compareSync(password, hashed_password);
}
