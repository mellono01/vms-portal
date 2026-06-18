interface Form {
  AuditUserId: string;
  CedowToken: string;
  Deleted: boolean;
  EmailAddress: string;
  ExpiryDate: string;
  FormStatus: {
    id: string;
    Name: string;
  };
  FormType: {
    id: string;
    Name: string;
  };
  OrganisationName: string;
  OrganisationAbn: string;
  PhoneNumber: string;
  SchemaVersion: number;
  State: string;
  SubmittedDate: string;
  Undertaking: [];
  _id: string;  
}

export interface GetEntityFormsResponse {
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  CedowToken: string;
  DateOfBirth: string;
  Claims: [];
  Deleted: boolean;
  Forms: Form[];
  SchemaVersion: number;
  AuditUserId: string;
}