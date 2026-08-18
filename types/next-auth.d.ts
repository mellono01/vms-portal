import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

import { GetEntityFormsResponse } from "./api/GetEntityForms.response.dto";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      method: 'sign-in' | 'mfa-sign-in' | 'sign-up' | 'unknown';
      mfaVerified: boolean;
      cedowToken: string;
      firstName?: string;
      lastName: string;
      emails: { masked: string; id: string }[];
      phones: { masked: string; id: string }[];
      email?: string;
      details?: GetEntityFormsResponse;
    }
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    method: 'sign-in' | 'mfa-sign-in' | 'sign-up' | 'unknown';
    mfaVerified: boolean;
    cedowToken: string;
    lastName: string;
    emails: { id: string; masked: string; unmasked: string }[];
    details?: GetEntityFormsResponse;
  }
  interface Session {
    details?: {
      FirstName?: string;
      MiddleName?: string;
      LastName?: string;
      DateOfBirth?: string;
      Email?: string;
      Phone?: string;
    };
    user?: DefaultSession["user"];
  }
}