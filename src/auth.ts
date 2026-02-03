import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// API
import getEntityForms from '@/lib/api/requests/getEntityForms';
import postEntityExists from '@/lib/api/requests/postEntityExists';

export const authOptions: AuthOptions = {
  providers: [
    // Sign In Provider
    CredentialsProvider({
      id: 'sign-in',
      name: 'Sign In',
      credentials: {
        CedowToken: { label: 'CedowToken', type: 'text' },
        Surname: { label: 'Surname', type: 'text' }
      },
      async authorize(credentials, req) {
        console.log('req:', req);
        try {
          const result = await getEntityForms({
            CedowToken: credentials?.CedowToken || '',
            LastName: credentials?.Surname || '',
          });
          
          if(result.length > 0) {
            return result[0];
          }
          return null;
        } catch (err) {
          console.error('Error in authorize function:', err);
          return null;
        }
      }
    }),
    // Sign Up Provider
    CredentialsProvider({
      id: 'sign-up',
      name: 'Sign Up',
      credentials: {
        FirstName: { label: 'First Name', type: 'text' },
        LastName: { label: 'Last Name', type: 'text' },
        Email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        console.log('credentials:', credentials);
        try {
          // Step 1: Check if user already exists
          const response = await postEntityExists({
            FirstName: credentials?.FirstName || '',
            LastName: credentials?.LastName || '',
            Email: credentials?.Email || '',
          });
          
          if (response.exists) {
            // User already exists, don't allow sign up
            return null;
          }

          // Step 2: Create new user object (no API call to create yet)
          // Return the user data to create a session
          const newUser = {
            id: `temp-${Date.now()}`, // Temporary ID or generate one
            Email: credentials?.Email || '',
            FirstName: credentials?.FirstName || '',
            LastName: credentials?.LastName || '',
            // Add any other fields
          };

          return newUser;
        } catch (err) {
          console.error('Error in sign-up authorize:', err);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Store user data in the token when they first sign in
      if (user) {
        // Add any properties from API response
        token = { ...user };
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session
      if (session.user) {

        session.user = { ...token } as any;
        // Add any other fields
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}