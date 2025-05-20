import { z } from "zod";
import { REQUIRED_FIELD } from "../shared/error_messages";
import { failure, Result, success } from "../shared/result";
import { nonEmptyString } from "../shared/zod-types";
import { Application, ApplicationStatus } from "./applications";

const optionalNonEmptyString = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }
    const trimmed = value.trim();

    return trimmed ? trimmed : undefined;
  });

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

export type CreateApplicationData = z.infer<typeof CreateApplicationSchema>;

export type CreateApplicationError = {
  [K in keyof CreateApplicationData]?: string[];
};

export type CreateApplicationSuccess = {
  redirectUrl: string;
  revalidatePath: string;
};

export type CreateApplicationResult = Result<
  CreateApplicationSuccess,
  CreateApplicationError
>;

export default async function createApplication(
  userId: number,
  formData: FormData,
  createApplicationFn: (
    userId: number,
    createApplicationData: CreateApplicationData,
  ) => Promise<Application>,
): Promise<CreateApplicationResult> {
  const data = Object.fromEntries(formData.entries());
  const result = CreateApplicationSchema.safeParse(data);

  if (!result.success) {
    return failure(result.error.flatten().fieldErrors);
  }
  await createApplicationFn(userId, result.data);

  return success({
    redirectUrl: "/applications",
    revalidatePath: "/applications",
  });
}
