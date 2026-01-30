"use server"

import { v4 as uuid } from 'uuid';

export async function vmsApi({
  endpointUrl,
  method,
  data
}:{
  endpointUrl: string;
  method: string;
  data?: any;
}) {
  if(!process.env.VMS_API_BASE_PATH) {
    throw new Error('[VMS API Requestor] VMS API base path is not defined');
  }
  if(!process.env.VMS_API_PROTOCOL) {
    throw new Error('[VMS API Requestor] VMS API protocol is not defined');
  }
  if (!process.env.VMS_API_BASIC_AUTH_USERNAME || !process.env.VMS_API_BASIC_AUTH_PASSWORD) {
    throw new Error('[VMS API Requestor] credentials not configured');
  }

  const basePath = process.env.VMS_API_PROTOCOL + process.env.VMS_API_BASE_PATH;

  const username = process.env.VMS_API_BASIC_AUTH_USERNAME;
  const password = process.env.VMS_API_BASIC_AUTH_PASSWORD;

  

  const headers = new Headers({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
    'x-correlation-id': uuid()
  });

  try {
    console.log(`[VMS API Requestor] Making ${method} request to ${basePath+endpointUrl}`);
    const response = await fetch(basePath+endpointUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `VMS API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    if(response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('VMS API request error:', error);
    throw error;
  }
}