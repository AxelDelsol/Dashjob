import { ActionState } from "@/lib/shared/server-action";

export function expectInvalidField<T>(
  actionState: ActionState<T>,
  field: keyof T,
  ...errors: string[]
) {
  expect(actionState.data[field]).toBeUndefined();
  for (const error of errors) {
    expect(actionState.errors[field]).toContain(error);
  }
}

export function expectValidField<T, Key extends keyof ActionState<T>["data"]>(
  actionState: ActionState<T>,
  field: Key,
  value: ActionState<T>["data"][Key],
) {
  expect(actionState.data[field]).toBe(value);
  expect(actionState.errors[field]).toBeUndefined();
}
