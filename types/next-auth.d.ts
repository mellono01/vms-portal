import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Token {
    user: {
      cedowToken: string;
      lastName: string;
      emails: { masked: string; id: string }[];
      mfaVerified: boolean;
    }
  }
  interface Session {
    user: {
      cedowToken: string;
      lastName: string;
      emails: { masked: string; id: string }[];
      mfaVerified: boolean;
    }
  }
}