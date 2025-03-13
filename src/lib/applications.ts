
import sql from './db';
import { Application } from "./definitions";


export async function fetchApplications(){
  try {
    const data = await sql<Application[]>`
      SELECT applications.id, applications.title, applications.company_name, applications.description, applications.status, applications.application_date
      FROM applications`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the applications.');
  }
}