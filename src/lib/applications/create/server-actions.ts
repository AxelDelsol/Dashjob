"use server";

import { auth } from "@/auth";
import { containsErrors } from "@/lib/shared/server-action";
import { revalidatePath } from "next/cache";
import { redirect, unauthorized } from "next/navigation";
import {
  action,
  CreateApplicationActionState,
  createUserApplication,
} from "./internal-actions";

export async function createApplicationAction(
  _prevState: CreateApplicationActionState,
  formData: FormData,
) {
  const session = await auth();
  const user = session?.user;

  if (!user) return unauthorized();

  const onSuccess = createUserApplication.bind(null, user.userId);
  const newActionState = await action(formData, onSuccess);

  if (containsErrors(newActionState)) {
    return newActionState;
  }

  revalidatePath("/applications");
  redirect("/applications");
}
