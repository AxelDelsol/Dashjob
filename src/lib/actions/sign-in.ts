"use server";

import { redirect } from "next/navigation";
import { comparePasswords, getUserByEmail } from "../users";

export type SignInError = {
  email?: string;
  password?: string;
};

const UNKNOWN_EMAIL = "L'adresse email n'existe pas";
const USER_NOT_VALIDATED = "L'utilisateur n'est pas encore validé";
const INVALID_PASSWORD = "Le mot de passe est incorrect";

export async function signInAction(prevState: SignInError, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const user = await getUserByEmail(data.email.toString());

  if (!user) {
    return { email: UNKNOWN_EMAIL };
  }

  if (!(user.status === "validated")) {
    return { email: USER_NOT_VALIDATED };
  }

  if (!comparePasswords(data.password.toString(), user.hashed_password)) {
    return { password: INVALID_PASSWORD };
  }
  redirect("/applications");
}
