import { serverAction } from "@/lib/shared/server-action";
import { z } from "zod";

const TestSchema = z.object({
  name: z.string(),
  age: z.coerce.number().positive(),
});

function createValidFormData() {
  const formData = new FormData();
  formData.set("name", "John");
  formData.set("age", "18");

  return formData;
}

describe("server action", () => {
  it("returns an ActionState - invalid input", async () => {
    const formData = createValidFormData();
    formData.delete("name");

    const actionState = await serverAction(TestSchema, formData);

    expect(actionState.data.name).toBeUndefined();
    expect(actionState.errors.name).toHaveLength(1);
  });

  it("does not call the onSuccess callback - invalid input", async () => {
    const formData = new FormData();

    let called = false;
    const onSuccess = async () => {
      called = true;
    };

    await serverAction(TestSchema, formData, onSuccess);
    expect(called).toBeFalsy();
  });

  it("returns an ActionState - valid input", async () => {
    const formData = createValidFormData();
    formData.set("name", "foo");
    formData.set("age", "15");

    const actionState = await serverAction(TestSchema, formData);

    expect(actionState.data.name).toBe(formData.get("name"));
    expect(actionState.parsedData!.name).toBe("foo");

    expect(actionState.data.age).toBe(formData.get("age"));
    expect(actionState.parsedData!.age).toBe(15);

    expect(actionState.errors).toEqual({});
  });

  it("does not call the onSuccess callback - invalid input", async () => {
    const formData = createValidFormData();

    let called = false;
    const onSuccess = async () => {
      called = true;
    };

    await serverAction(TestSchema, formData, onSuccess);
    expect(called).toBeTruthy();
  });
});
