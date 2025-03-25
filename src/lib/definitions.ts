export type Application = {
  id: number,
  title: string,
  company_name: string,
  status: ApplicationStatus,
  application_date: Date,
  description?: string,
  annual_salary?: number 
}

export type ApplicationStatus = 'applied' | 'pending' | 'rejected' | 'accepted';

export type User = {
  id: number,
  email: string,
  hashed_password: string,
  status: UserStatus
}

export type UserStatus = 'pending' | 'validated';