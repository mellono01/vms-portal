export interface FormStatus {
  id: string;
  Name: string;
}

export interface FormType {
  id: string;
  Name: string;
}

export interface Undertaking_Version {
  version: string;
}

export interface Undertaking_Questions {
  question: string;
  responses: string[];
  offences?: string[];
}

export interface Form {
  _id?: string;
  CedowToken: string,
  SubmittedDate: string | null,
  ExpiryDate?: string | null,
  EmailAddress?: string,
  PhoneNumber?: string,
  OrganisationName?: string,
  OrganisationAbn?: string,
  DescriptionOfServices?: string,
  WwccNumber?: string,
  WwccExpiryDate?: string | null,
  WwccVerificationDate?: string | null,
  WwccAppNumber?: string,
  WwccAppVerificationDate?: string | null,
  FormStatus: FormStatus,
  FormType: FormType,
  Locations?: string[],
  Undertaking?: [Undertaking_Version, ...Undertaking_Questions[]],
  Comments?: string,
  State?: string,
  AuditUserId: string | null,
  Deleted: boolean,
  SchemaVersion: number,
  newForm?: null;
}