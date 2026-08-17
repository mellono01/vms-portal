"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function postEntityExists({
  FirstName,
  LastName,
  Email,
}:{
  FirstName: string;
  LastName: string;
  Email: string;
}) {
  const logPrefix = '[POST][EntityExists]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/entity/exists'

  const body = {
    FirstName: FirstName.trim(),
    LastName: LastName.trim(),
    Email: Email.trim()
  };

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    });
    
    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during postEntityExists request`, error);
    throw new Error(`${logPrefix} An error occurred: ${error instanceof Error ? error.message : String(error)}`);
  }
}