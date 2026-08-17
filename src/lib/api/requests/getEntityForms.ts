"use server"

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'

import { vmsApi } from "../vmsApiRequestor";

export default async function getEntityForms() {
  const session = await getServerSession(authOptions);
  const logPrefix = '[GET][EntityForms]';

  if (!session?.user) {
    throw new Error(`${logPrefix} No valid session found. User may not be authenticated.`);
  }

  if (!process.env.VMS_API_BASE_PATH) {
    throw new Error(`${logPrefix} VMS API base path is not defined`);
  }

  const endpointUrl = '/entity/forms'
  const queryParams = new URLSearchParams();

  const CedowToken = session.user.cedowToken || session.user.details?.CedowToken;
  const LastName = session.user.lastName || session.user.details?.LastName;

  if (!CedowToken || !LastName) {
    throw new Error(`${logPrefix} Missing required user details: CedowToken or LastName`);
  }

  queryParams.append('token', CedowToken.trim());
  queryParams.append('lastName', LastName.trim());

  const fullEndpointUrl = `${endpointUrl}?${queryParams.toString()}`;

  try {
    return await vmsApi({
      endpointUrl: fullEndpointUrl,
      method: 'GET',
    });
  } catch (error) {
    console.error(`${logPrefix} Error during getEntityForms request`, error);
    throw error;
  }
}