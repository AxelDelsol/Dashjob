import sql from "@/lib/shared/db";
import {
  authenticateUser,
  createUser,
  findValidUserByEmail,
  UserStatus,
} from "@/lib/users/users";
import { clearDatabase } from "../../db-helpers";

beforeEach(() => {
  return clearDatabase();
});

afterAll(async () => {
  return sql.end();
});

describe("findValidUserByEmail", () => {
  it("returns undefined if the user does not exist", async () => {
    const email = "test@example.com";

    const user = await findValidUserByEmail(email);

    expect(user).toBeUndefined();
  });

  it("returns the undefined if found and pending", async () => {
    await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Pending,
    });

    const user = await findValidUserByEmail("email");

    expect(user).toBeUndefined();
  });

  it("returns the user if found and validated", async () => {
    const expectedUser = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const user = await findValidUserByEmail("email");

    expect(user).toEqual(expectedUser);
  });
});

describe("createUser", () => {
  it("returns the created user", async () => {
    const expectedUser = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const expectedProperties = {
      email: "email",
      status: UserStatus.Validated,
    };

    expect(expectedUser).toMatchObject(expectedProperties);

    expect(
      authenticateUser({ email: "email", password: "password" }),
    ).toBeTruthy();
  });

  it("does not fail if the user already exists", async () => {
    await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const user = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    expect(user).toBeUndefined();

    expect(
      authenticateUser({ email: "email", password: "password" }),
    ).toBeTruthy();
  });
});

describe("authenticateUser", () => {
  it("accepts a validated user with the right credentials", async () => {
    const existingUser = await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Validated,
    });

    const user = await authenticateUser({
      email: "email",
      password: "password",
    });
    expect(user).toEqual(existingUser);
  });

  it("rejects a pending user", async () => {
    await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Pending,
    });

    const user = await authenticateUser({
      email: "email",
      password: "password",
    });
    expect(user).toBeUndefined();
  });

  it("rejects invalid credentials", async () => {
    await createUser({
      email: "email",
      password: "password",
      status: UserStatus.Pending,
    });

    const user = await authenticateUser({
      email: "email",
      password: "invalid-password",
    });
    expect(user).toBeUndefined();
  });
});
