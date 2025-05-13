import { ActionState } from "@/lib/shared/server-action";

export function expectInvalidField<T>(
  actionState: ActionState<T>,
  field: keyof T,
  ...errors: string[]
) {
  expect(actionState.data[field]).toBeUndefined();
  expect(actionState.parsedData).toBeUndefined();
  for (const error of errors) {
    expect(actionState.errors[field]).toContain(error);
  }
}

export function expectValidField<T, Key extends keyof T>(
  actionState: ActionState<T>,
  field: Key,
  value: T[Key],
) {
  expect(actionState.parsedData![field]).toBe(value);
  expect(actionState.errors[field]).toBeUndefined();
}
