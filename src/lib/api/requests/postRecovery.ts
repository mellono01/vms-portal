"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function postRecovery({
  FirstName,
  LastName,
  Email,
}:{
  FirstName: string;
  LastName: string;
  Email: string;
}) {
  const logPrefix = '[POST][Recovery]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/entity/exists'; // TODO: confirm actual VMS API endpoint

  const body = {
    FirstName: FirstName.trim(),
    LastName: LastName.trim(),
    Email: Email.trim(),
  };

  try {
    const response = await vmsApi({
      endpointUrl: endpointUrl,
      method: 'POST',
      data: body,
    })

    return response;
  } catch (error) {
    console.error(`${logPrefix} Error during recovery request`, error);
    throw error;
  }
}
