export type Application = {
  id: number;
  userId: number;
  title: string;
  companyName: string;
  status: ApplicationStatus;
  applicationDate: Date;
  description?: string;
  annualSalary?: number;
};

export enum ApplicationStatus {
  Applied = "applied",
  Pending = "pending",
  Rejected = "rejected",
  Accepted = "accepted",
}
