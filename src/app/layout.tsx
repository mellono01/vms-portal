import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import SessionWrapper from "@/lib/SessionWrapper";

import { StoreProvider } from "@/lib/providers/storeProvider";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';

import Navigation from '@components/navigation/navigation'

import Providers from './providers'
import { CssBaseline } from "@mui/material";

export const metadata: Metadata = {
  title: process.env.ENVIRONMENT_NAME_SHORT !== "prod" 
    ? `(${process.env.NEXT_PUBLIC_ENVIRONMENT_NAME_SHORT?.toUpperCase()}) ${process.env.NEXT_PUBLIC_APPLICATION_NAME}` 
    : `${process.env.NEXT_PUBLIC_APPLICATION_NAME}`,
  description: "VMS Portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <InitColorSchemeScript attribute="class" />
          <Providers>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <SessionWrapper session={session}>
                  <Navigation/>
                  <main>
                    <StoreProvider>
                      {children}
                    </StoreProvider>
                  </main>
                </SessionWrapper>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </Providers>
      </body>
    </html>
  )
}