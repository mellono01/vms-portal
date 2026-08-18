"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function postMfa({
  Email,
  Phone
}:{
  Email: string;
  Phone: string;
}) {
  const logPrefix = '[POST][MFA]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/mfa'

  const body = {
    Email: Email.trim(),
    Phone: Phone.trim(),
  };

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    });
    
    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during MFA request`, error);
    throw error;
  }
}