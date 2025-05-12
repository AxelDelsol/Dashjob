import { REQUIRED_FIELD, requiredString } from "@/lib/shared/error_messages";
import { ActionState, serverAction } from "@/lib/shared/server-action";
import { z } from "zod";
import createApplication from "../create-application";
import { ApplicationStatus } from "../definitions";

const CreateApplicationSchema = z.object({
  title: requiredString,
  companyName: requiredString,
  status: z.nativeEnum(ApplicationStatus, {
    required_error: REQUIRED_FIELD,
  }),
  applicationDate: requiredString.date(),
  description: z.string().optional(),
  annualSalary: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional()
    .pipe(z.coerce.number().optional()),
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
