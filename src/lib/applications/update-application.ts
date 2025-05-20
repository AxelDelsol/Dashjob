import { z } from "zod";
import { REQUIRED_FIELD } from "../shared/error_messages";
import { failure, Result, success } from "../shared/result";
import { nonEmptyString } from "../shared/zod-types";
import { Application, ApplicationStatus } from "./applications";

const applicationStatus = z.nativeEnum(ApplicationStatus, {
  required_error: REQUIRED_FIELD,
});

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

export type UpdateApplicationData = z.infer<typeof UpdateApplicationSchema>;

export type UpdateApplicationError = {
  [K in keyof UpdateApplicationData]?: string[];
};

export type UpdateApplicationSuccess = {
  redirectUrl: string;
  revalidatePath: string;
};

export type UpdateApplicationResult = Result<
  UpdateApplicationSuccess,
  UpdateApplicationError
>;

export default async function updateApplication(
  formData: FormData,
  updateApplicationFn: (
    createApplicationData: UpdateApplicationData,
  ) => Promise<Application | undefined>,
): Promise<UpdateApplicationResult> {
  const data = Object.fromEntries(formData.entries());
  const result = UpdateApplicationSchema.safeParse(data);

  if (!result.success) {
    return failure(result.error.flatten().fieldErrors);
  }
  await updateApplicationFn(result.data);

  return success({
    redirectUrl: "/applications",
    revalidatePath: "/applications",
  });
}
