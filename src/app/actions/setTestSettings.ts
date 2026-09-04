'use server'

import { cookies } from 'next/headers';

import {
  TEST_SETTINGS_COOKIE,
  defaultTestSettings,
  isTestEnvironment,
  parseTestSettings,
  serialiseTestSettings,
  useSecureCookie,
} from '@/lib/testSettings/testSettings';

// DTO
import type { TestSettings } from '@/lib/testSettings/testSettings';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

/**
 * Persist the developer test settings in an HttpOnly cookie.
 *
 * The incoming value is re-validated against the allowlist before it is
 * written, so a crafted call cannot store an arbitrary email or phone number.
 * Returns the settings as they were actually stored.
 */
export async function setTestSettings(settings: TestSettings): Promise<TestSettings> {
  if (!isTestEnvironment()) return defaultTestSettings;

  const sanitised = parseTestSettings(serialiseTestSettings(settings));

  const cookieStore = await cookies();

  cookieStore.set(TEST_SETTINGS_COOKIE, serialiseTestSettings(sanitised), {
    httpOnly: true,      // not readable via document.cookie, so XSS cannot lift it
    secure: useSecureCookie,
    sameSite: 'lax',
    path: '/',           // required by the __Host- prefix
    maxAge: THIRTY_DAYS,
  });

  return sanitised;
}

/** Clear the cookie, returning the settings to their defaults. */
export async function clearTestSettings(): Promise<TestSettings> {
  const cookieStore = await cookies();
  cookieStore.delete(TEST_SETTINGS_COOKIE);
  return defaultTestSettings;
}
