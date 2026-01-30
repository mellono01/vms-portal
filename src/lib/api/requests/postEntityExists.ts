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
  console.log('Request body for postEntityExists:', body);

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    });
    
    if(response.status === 200) {
      console.log('Response from postEntityExists:', response);
      return response;
    } else {
      throw new Error(`${logPrefix} VMS API responded with status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`${logPrefix} An error occurred: ${error instanceof Error ? error.message : String(error)}`);
  }
}