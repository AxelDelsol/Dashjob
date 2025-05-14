import { REQUIRED_FIELD } from "@/lib/shared/error_messages";
import { ActionState, serverAction } from "@/lib/shared/server-action";
import { nonEmptyString, optionalNonEmptyString } from "@/lib/shared/zod-types";
import { z } from "zod";
import createApplication from "../create-application";
import { ApplicationStatus } from "../definitions";

const CreateApplicationSchema = z.object({
  title: nonEmptyString,
  companyName: nonEmptyString,
  status: z.nativeEnum(ApplicationStatus, {
    required_error: REQUIRED_FIELD,
  }),
  applicationDate: nonEmptyString.pipe(z.string().date()),
  description: optionalNonEmptyString,
  annualSalary: optionalNonEmptyString.pipe(z.coerce.number().optional()),
});

type CreateApplicationData = z.infer<typeof CreateApplicationSchema>;
export type CreateApplicationActionState = ActionState<CreateApplicationData>;

export async function action(
  formData: FormData,
  onSuccess?: (
    newActionState: CreateApplicationActionState,
    data: CreateApplicationData,
  ) => Promise<void>,
) {
  return serverAction(CreateApplicationSchema, formData, onSuccess);
}

export async function createUserApplication(
  userId: number,
  newActionState: CreateApplicationActionState,
  data: CreateApplicationData,
) {
  await createApplication({
    ...data,
    applicationDate: new Date(data.applicationDate),
    userId: userId,
  });
}
