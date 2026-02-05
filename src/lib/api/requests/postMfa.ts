"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function postMfa({
  Email,
  MfaCode,
}:{
  Email: string;
  MfaCode: string;
}) {
  const logPrefix = '[POST][MFA]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/mfa'

  const body = {
    Email: Email.trim(),
    Code: MfaCode.trim(),
  };

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    });
    
    if(response.status === 200) {
      return response.data;
    } else {
      throw new Error(`${logPrefix} VMS API responded with status ${response.status}`);
    }
  } catch (error) {
    console.error(`${logPrefix} Error during MFA request:`, error);
    throw error;
  }
}