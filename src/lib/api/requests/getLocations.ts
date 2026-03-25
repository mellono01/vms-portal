"use server"

import { vmsApi } from "../vmsApiRequestor";

export default async function getLocations() {
  const logPrefix = '[GET][Locations]';

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/locations/schools'

  const fullEndpointUrl = `${endpointUrl}`;

  try {
    const response = await vmsApi({
      endpointUrl: fullEndpointUrl,
      method: 'GET',
    });
    
    if(response.status === 200) {
      // console.log('Response from getEntityForms:', response);
      return response.data;
    } else {
      throw new Error(`${logPrefix} VMS API responded with status ${response.status}`);
    }
  } catch (error) {

  }
}