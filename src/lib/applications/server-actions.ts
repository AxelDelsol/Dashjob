"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createUserApplication,
  deleteUserApplication,
  updateUserApplication,
} from "./applications";
import createApplication, {
  CreateApplicationData,
  CreateApplicationError,
} from "./create-application";
import updateApplication, {
  UpdateApplicationData,
  UpdateApplicationError,
} from "./update-application";

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
  const createAppFn = async (createApplicationData: CreateApplicationData) => {
    return createUserApplication(userId, {
      ...createApplicationData,
      applicationDate: new Date(createApplicationData.applicationDate),
    });
  };

  const { success, result } = await createApplication(formData, createAppFn);

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

export type UpdateApplicationActionState = ActionState<UpdateApplicationError>;
export async function updateApplicationAction(
  userId: number,
  applicationId: number,
  _prevState: UpdateApplicationActionState,
  formData: FormData,
) {
  const updateAppFn = async (updateApplicationData: UpdateApplicationData) => {
    return updateUserApplication(userId, applicationId, {
      ...updateApplicationData,
      applicationDate: new Date(updateApplicationData.applicationDate),
    });
  };

  const { success, result } = await updateApplication(formData, updateAppFn);

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
