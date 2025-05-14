"use server";

import { containsErrors } from "@/lib/shared/server-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  action,
  UpdateApplicationActionState,
  updateUserApplication,
} from "./internal-actions";

export async function updateApplicationAction(
  userId: number,
  applicationId: number,
  _prevState: UpdateApplicationActionState,
  formData: FormData,
) {
  const onSuccess = updateUserApplication.bind(null, userId, applicationId);
  const newActionState = await action(formData, onSuccess);

  if (containsErrors(newActionState)) {
    return newActionState;
  }

  revalidatePath("/applications");
  redirect("/applications");
}
