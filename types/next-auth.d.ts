import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      cedowToken: string;
      lastName: string;
      emails: { masked: string; id: string }[];
      mfaVerified: boolean;
    }
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    cedowToken: string;
    lastName: string;
    emails: { id: string; masked: string; unmasked: string }[];
    mfaVerified: boolean;
  }
}