import postgres from 'postgres'

const sql =
  process.env.NODE_ENV === 'production'
    ? 
      postgres(process.env.DATABASE_URL!, { ssl: 'verify-full' })
    : postgres(process.env.DATABASE_URL!)

export default sql
