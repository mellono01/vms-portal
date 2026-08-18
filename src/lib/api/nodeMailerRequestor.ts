"use server"

import { headers as nextHeaders } from 'next/headers';

import {
  CORRELATION_ID_HEADER,
  getOrCreateCorrelationId,
} from '@/lib/correlation-id';

export async function emailApi({
  endpointUrl,
  method,
  data
}:{
  endpointUrl: string;
  method: string;
  data?: any;
}) {
  if(!process.env.EMAIL_API_BASE_PATH) {
    throw new Error('[Email API Requestor] Base path is not defined');
  }
  if(!process.env.EMAIL_API_PROTOCOL) {
    throw new Error('[Email API Requestor] Protocol is not defined');
  }
  if (!process.env.EMAIL_API_BASIC_AUTH_USERNAME || !process.env.EMAIL_API_BASIC_AUTH_PASSWORD) {
    throw new Error('[Email API Requestor] credentials not configured');
  }

  const basePath = process.env.EMAIL_API_PROTOCOL + process.env.EMAIL_API_BASE_PATH;

  const username = process.env.EMAIL_API_BASIC_AUTH_USERNAME;
  const password = process.env.EMAIL_API_BASIC_AUTH_PASSWORD;
  const requestHeaders = await nextHeaders();
  const correlationId = getOrCreateCorrelationId(requestHeaders);

  const outboundHeaders = new Headers({
    'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    'Content-Type': 'application/json',
    [CORRELATION_ID_HEADER]: correlationId
  });

  try {
    console.log(`[Email API Requestor] Making request to ${basePath + endpointUrl}`, {
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
        `Email API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    if(response.ok) {
      const body = await response.json();
      if (body && typeof body === 'object' && 'data' in body) {
        return body.data;
      }
      return body;
    }
  } catch (error) {
    console.error('Email API request error', {
      correlationId,
      method,
      endpointUrl,
      error,
    });

    throw error;
  }
}