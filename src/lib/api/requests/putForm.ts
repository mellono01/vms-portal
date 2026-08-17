"use server"

import { vmsApi } from "../vmsApiRequestor";

export interface PutForm {
  _id: string,
  CedowToken: string,
  SubmittedDate: string | null ,
  ExpiryDate?: string | null,
  EmailAddress?: string,
  PhoneNumber?: string,
  OrganisationName?: string,
  OrganisationAbn?: string,
  DescriptionOfServices?: string | null,
  WwccNumber?: string,
  WwccExpiryDate?: string | null,
  WwccVerificationDate?: string | null,
  WwccAppNumber?: string,
  WwccAppVerificationDate?: string | null,
  FormStatus: {
    Name: string;
    id: string;
  },
  FormType: {
    Name: string;
    id: string;
  },
  Locations?: string[],
  Undertaking?: any[],
  Comments?: string,
  State?: string,
  AuditUserId: string | null,
  Deleted: boolean,
  SchemaVersion: number,
}

export default async function putForm({
  data
}: {
  data: PutForm
}): Promise<any> {
  const logPrefix = '[PUT][Form]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = `/forms/${data._id?.trim()}`;

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'PUT',
      data,
    });
    
    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during putForm request`, error);
    throw new Error(`${logPrefix} An error occurred: ${error instanceof Error ? error.message : String(error)}`);
  }
};