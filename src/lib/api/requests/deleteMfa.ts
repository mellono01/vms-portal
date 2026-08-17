"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function deleteMfa({
  id,
}:{
  id: string;
}) {
  const logPrefix = '[DELETE][MFA]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = `/mfa/${id}`;

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'DELETE',
    });
    
    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during MFA request`, error);
    throw error;
  }
}