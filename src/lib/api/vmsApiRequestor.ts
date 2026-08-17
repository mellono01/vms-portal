"use server"

import { headers as nextHeaders } from 'next/headers';

import {
  CORRELATION_ID_HEADER,
  getOrCreateCorrelationId,
} from '@/lib/correlation-id';

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
  const requestHeaders = await nextHeaders();
  const correlationId = getOrCreateCorrelationId(requestHeaders);

  const outboundHeaders = new Headers({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
    [CORRELATION_ID_HEADER]: correlationId
  });

  try {
    console.log(`[VMS API Requestor] Making request to ${basePath + endpointUrl}`, {
      correlationId,
      method,
      endpointUrl,
    });

    const response = await fetch(basePath+endpointUrl, {
      method,
      headers: outboundHeaders,
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
      const body = await response.json();
      // Some VMS API endpoints wrap the payload in an envelope, e.g.
      // { endpoint, method, status, timestamp, data }. Unwrap it so
      // callers always receive the actual payload.
      if (body && typeof body === 'object' && 'data' in body) {
        return body.data;
      }
      return body;
    }
  } catch (error) {
    console.error('VMS API request error', {
      correlationId,
      method,
      endpointUrl,
      error,
    });

    throw error;
  }
}