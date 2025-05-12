import bcrypt from "bcryptjs";
import sql from "../shared/db";
import { User } from "./definitions";

export type CreateUser = Pick<User, "email" | "status"> & { password: string };

export default async function createUser({
  email,
  password,
  status,
}: CreateUser) {
  const user = {
    email: email,
    hashedPassword: bcrypt.hashSync(password, 10),
    status: status,
  };
  const insertedUsers = await sql`
  INSERT INTO users ${sql(user)}
  RETURNING *`;

  return insertedUsers[0] as User;
}
