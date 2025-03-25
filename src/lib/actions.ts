'use server';

import { redirect } from "next/navigation";
import { UserCreate } from "./users";

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



  redirect('/applications');
}