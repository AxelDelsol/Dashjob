import sql from "../shared/db";
import { User } from "./definitions";

export default async function findValidUserByEmail(email: string) {
  const data = await sql<User[]>`
      SELECT ${sql("id", "email", "hashedPassword", "status")}
      FROM users
      WHERE users.email = ${email} and users.status = 'validated'`;

  return data[0];
}
