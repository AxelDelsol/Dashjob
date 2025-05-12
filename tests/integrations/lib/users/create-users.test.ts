import sql from "@/lib/shared/db";
import createUser from "@/lib/users/create-user";
import { UserStatus } from "@/lib/users/definitions";
import { comparePasswords } from "@/lib/users/sign-in/compare-passwords";
import { clearDatabase } from "../../db-helpers";

describe("createUser", () => {
  beforeEach(async () => {
    return clearDatabase();
  });

  afterAll(async () => {
    return sql.end();
  });

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
      comparePasswords("password", expectedUser.hashedPassword),
    ).toBeTruthy();
  });
});
