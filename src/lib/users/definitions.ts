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
