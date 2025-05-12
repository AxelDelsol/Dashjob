import postgres from "postgres";

export const UNIQUE_VIOLATION = "23505";

const options = {
  onnotice: () => {},
  transform: postgres.camel,
};

const sql =
  process.env.NODE_ENV === "production"
    ? postgres(process.env.DATABASE_URL!, { ...options, ssl: "verify-full" })
    : postgres(process.env.DATABASE_URL!, options);

export default sql;
