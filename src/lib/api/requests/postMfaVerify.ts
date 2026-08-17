"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function postMfaVerify({
  Email,
  MfaCode,
}:{
  Email: string;
  MfaCode: string;
}) {
  const logPrefix = '[POST][MfaVerify]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/mfa/verify'

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
    
    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during MFA verify request`, error);
    throw error;
  }
}