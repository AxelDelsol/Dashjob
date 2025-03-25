'use server';

import { redirect } from "next/navigation";
import postgres from 'postgres';

import { UNIQUE_VIOLATION } from "./db";
import { createUser, EMAIL_ALREADY_TAKEN, UserCreate } from "./users";

export type SignUpError = {
  email?: string[],
  password?: string[],
  confirmedPassword?: string[]  
}

export async function signUpAction(prevState: SignUpError, formData: FormData) {
  const validatedFields = UserCreate.safeParse({
    email: formData.get('email'),
    password : formData.get('password'),
    confirmedPassword : formData.get('confirmedPassword'),

  })
  
  if (!validatedFields.success) {
    return {...validatedFields.error.flatten().fieldErrors};
  }

  try {
    await createUser(validatedFields.data.email, validatedFields.data.password)
    redirect('/applications');
  }catch (error) {
    if (error instanceof postgres.PostgresError && error.code === UNIQUE_VIOLATION) {
      return { email: [EMAIL_ALREADY_TAKEN] }
    } else {
      throw error;
    }
  }
}