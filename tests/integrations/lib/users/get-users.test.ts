import sql from "@/lib/shared/db";
import createUser from "@/lib/users/create-user";
import { UserStatus } from "@/lib/users/definitions";
import findValidUserByEmail from "@/lib/users/get-users";
import { clearDatabase } from "../../db-helpers";

describe("findValidUserByEmail", () => {
  beforeEach(() => {
    return clearDatabase();
  });

  afterAll(async () => {
    return sql.end();
  });

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
