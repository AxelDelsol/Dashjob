import { z } from "zod";

export type ActionState<T> = {
  data: {
    [K in keyof T]?: string;
  };
  parsedData?: T;
  errors: {
    [K in keyof T]?: string[];
  };
};

export async function serverAction<
  Schema extends z.ZodTypeAny,
  T = z.infer<Schema>,
>(
  schema: Schema,
  formData: FormData,
  onSuccess?: (newActionState: ActionState<T>, data: T) => Promise<void>,
) {
  const data = Object.fromEntries(formData.entries());
  const actionState: ActionState<T> = {
    data: data as ActionState<T>["data"],
    errors: {},
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    actionState.errors = result.error.flatten().fieldErrors;

    for (const invalidField in actionState.errors) {
      actionState.data[invalidField as keyof T] = undefined;
    }
  } else {
    actionState.parsedData = result.data;
    if (onSuccess) await onSuccess(actionState, actionState.parsedData!);
  }

  return actionState;
}

export function containsErrors<T>(action: ActionState<T>) {
  return Object.keys(action.errors).length > 0;
}
