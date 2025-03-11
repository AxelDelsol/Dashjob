export type Application = {
  id: number,
  title: string,
  company: string,
  description?: string,
  status: ApplicationStatus,
  creation_date: Date
}

export type ApplicationStatus = 'applied' | 'pending' | 'rejected' | 'accepted';