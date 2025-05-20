"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUserApplication, deleteUserApplication } from "./applications";
import createApplication, {
  CreateApplicationData,
  CreateApplicationError,
} from "./create-application";

type ActionState<E> = {
  data: {
    [k: string]: FormDataEntryValue;
  };
  errors: E;
};

export type CreateApplicationActionState = ActionState<CreateApplicationError>;
export async function createApplicationAction(
  userId: number,
  _prevState: CreateApplicationActionState,
  formData: FormData,
) {
  const createAppFn = async (
    userId: number,
    createApplicationData: CreateApplicationData,
  ) => {
    return createUserApplication(userId, {
      ...createApplicationData,
      applicationDate: new Date(createApplicationData.applicationDate),
    });
  };

  const { success, result } = await createApplication(
    userId,
    formData,
    createAppFn,
  );

  if (success) {
    revalidatePath(result.revalidatePath);
    redirect(result.redirectUrl);
  } else {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: result,
    };
  }
}

export async function deleteApplicationAction(
  userId: number,
  applicationId: number,
) {
  await deleteUserApplication(userId, applicationId);

  revalidatePath("/applications");
  redirect("/applications");
}
