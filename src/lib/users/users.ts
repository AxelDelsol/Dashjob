import bcrypt from "bcryptjs";
import sql from "../shared/db";

export type User = {
  id: number;
  email: string;
  hashedPassword: string;
  status: UserStatus;
};

export enum UserStatus {
  Pending = "pending",
  Validated = "validated",
}

export async function findValidUserByEmail(email: string) {
  const data = await sql<User[]>`
      SELECT ${sql("id", "email", "hashedPassword", "status")}
      FROM users
      WHERE users.email = ${email} and users.status = 'validated'`;

  return data[0];
}

type CreateUser = Pick<User, "email" | "status"> & { password: string };
export async function createUser({ email, password, status }: CreateUser) {
  const user = {
    email: email,
    hashedPassword: bcrypt.hashSync(password, 10),
    status: status,
  };
  const insertedUsers = await sql`
  INSERT INTO users ${sql(user)}
  ON CONFLICT (email) DO NOTHING
  RETURNING *`;

  return insertedUsers[0] as User;
}

export async function authenticateUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await findValidUserByEmail(email);

  if (user && bcrypt.compareSync(password, user.hashedPassword)) {
    return user;
  }
}
