import sql from "@/lib/db";
import { User } from "@/lib/definitions";
import bcrypt from "bcryptjs";

export async function createUser(
  email: string,
  password: string,
  status: string = "pending",
) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  await sql`
  INSERT INTO users (email, hashed_password, status)
  VALUES (${email}, ${hashedPassword}, ${status})
  `;
}

export async function getValidUserByEmail(email: string) {
  const data = await sql<User[]>`
      SELECT
        users.id,
        users.email,
        users.hashed_password,
        users.status
      FROM users
      WHERE users.email = ${email} and users.status = 'validated'`;

  return data[0];
}

export function comparePasswords(password: string, hashed_password: string) {
  return bcrypt.compareSync(password, hashed_password);
}
