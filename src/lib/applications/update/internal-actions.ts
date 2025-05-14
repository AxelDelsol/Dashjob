import { REQUIRED_FIELD } from "@/lib/shared/error_messages";
import { ActionState, serverAction } from "@/lib/shared/server-action";
import { applicationStatus, nonEmptyString } from "@/lib/shared/zod-types";
import { z } from "zod";
import updateApplication from "../update-application";

const UpdateApplicationSchema = z.object({
  title: nonEmptyString,
  companyName: nonEmptyString,
  status: applicationStatus,
  applicationDate: nonEmptyString.pipe(z.string().date()),
  description: z
    .string({ required_error: REQUIRED_FIELD })
    .transform((value) => {
      if (!value) {
        return null;
      }
      const trimmed = value.trim();

      return trimmed ? trimmed : null;
    })
    .nullable(),
  annualSalary: z
    .string({ required_error: REQUIRED_FIELD })
    .transform((val) => (val.trim() ? Number(val) : null)),
});

type UpdateApplicationData = z.infer<typeof UpdateApplicationSchema>;
export type UpdateApplicationActionState = ActionState<UpdateApplicationData>;

export async function action(
  formData: FormData,
  onSuccess?: (
    newActionState: UpdateApplicationActionState,
    data: UpdateApplicationData,
  ) => Promise<void>,
) {
  return serverAction(UpdateApplicationSchema, formData, onSuccess);
}

export async function updateUserApplication(
  userId: number,
  applicationId: number,
  newActionState: UpdateApplicationActionState,
  data: UpdateApplicationData,
) {
  await updateApplication(userId, applicationId, {
    ...data,
    applicationDate: new Date(data.applicationDate),
  });
}
