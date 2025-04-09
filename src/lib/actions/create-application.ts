"use server";

export async function createApplicationAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  console.log(data);
}
