"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import deleteUserApplication from "../delete-application";

export default async function deleteApplicationAction(
  userId: number,
  applicationId: number,
) {
  await deleteUserApplication(userId, applicationId);

  revalidatePath("/applications");
  redirect("/applications");
}
