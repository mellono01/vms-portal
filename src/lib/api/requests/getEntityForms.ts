"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function getEntityForms({
  CedowToken,
  LastName,
}:{
  CedowToken: string;
  LastName: string;
}) {
  const logPrefix = '[GET][EntityForms]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/entity/forms'
  const queryParams = new URLSearchParams();

  queryParams.append('token', CedowToken.trim());
  queryParams.append('lastName', LastName.trim());

  const fullEndpointUrl = `${endpointUrl}?${queryParams.toString()}`;

  try {
    const response = await vmsApi({
      endpointUrl: fullEndpointUrl,
      method: 'GET',
    });
    
    if(response.status === 200) {
      console.log('Response from getEntityForms:', response);
      return response.data;
    } else {
      throw new Error(`${logPrefix} VMS API responded with status ${response.status}`);
    }
  } catch (error) {

  }
}