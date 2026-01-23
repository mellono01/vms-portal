export interface Claim {
  id: string;
  Name: string;
}

export interface Entity {
  _id: string;
  CedowToken: string;
  Claims: Claim[];
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DateOfBirth: string | null;
  Deleted: boolean;
  SchemaVersion: number;
  AuditUserId: string | null;
}