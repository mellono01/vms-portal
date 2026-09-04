import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import {
  TEST_SETTINGS_COOKIE,
  defaultTestSettings,
  isTestEnvironment,
  parseTestSettings,
} from './testSettings';

// DTO
import type { TestSettings } from './testSettings';

/**
 * Read the test settings in a server component, server action or route handler
 * that has access to the request context via `cookies()`.
 */
export async function getTestSettings(): Promise<TestSettings> {
  if (!isTestEnvironment()) return defaultTestSettings;
  const cookieStore = await cookies();
  return parseTestSettings(cookieStore.get(TEST_SETTINGS_COOKIE)?.value);
}

/**
 * Read the test settings from an explicit request, for route handlers that
 * already have the `NextRequest` to hand.
 */
export function getTestSettingsFromRequest(req: NextRequest): TestSettings {
  if (!isTestEnvironment()) return defaultTestSettings;
  return parseTestSettings(req.cookies.get(TEST_SETTINGS_COOKIE)?.value);
}
