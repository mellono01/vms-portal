// Shared test-settings definitions.
//
// Safe to import from both server and client code: it must not pull in
// `next/headers` or any other server-only module.

export interface TestSettings {
  displayMfa: boolean;
  prefillMfa: boolean;
  sendEmails: boolean;
  sendSms: boolean;
  email: string;
  mobile: string;
}

export const defaultTestSettings: TestSettings = {
  displayMfa: true,
  prefillMfa: true,
  sendEmails: false,
  sendSms: false,
  email: '',
  mobile: '',
};

// Allowed values, inlined from the environment at build time.
export const emailOptions: string[] = process.env.NEXT_PUBLIC_TEST_EMAIL_ADDRESSES?.split(',').filter(Boolean) || [];
export const mobileOptions: string[] = process.env.NEXT_PUBLIC_TEST_MOBILE_NUMBERS?.split(',').filter(Boolean) || [];

// The menu is only ever honoured in the lower environments. Both the client
// and the server check this, so flipping the environment disables the feature
// even if a stale cookie is still present in the browser.
export const isTestEnvironment = (): boolean =>
  ["DEV", "TEST"].includes((process.env.NEXT_PUBLIC_ENVIRONMENT_NAME_SHORT ?? '').toUpperCase());

// `__Host-` forces the browser to reject the cookie unless it is Secure, has
// no Domain (so it is never shared with sibling subdomains) and is scoped to
// Path=/. That combination is unavailable over plain http, so this keys off the
// deployed scheme rather than NODE_ENV: the lower environments are built with
// NODE_ENV=production but served over http, and a Secure cookie written there
// is silently dropped by the browser.
export const useSecureCookie = (process.env.NEXT_PUBLIC_HOST_URL ?? '').startsWith('https://');
export const TEST_SETTINGS_COOKIE = useSecureCookie
  ? '__Host-vms-test-settings'
  : 'vms-test-settings';

/**
 * Parse a cookie value into settings, discarding anything that is not an
 * allowed option. The cookie is user-controlled input, so the allowlist is
 * enforced on every read rather than only at write time.
 */
export function parseTestSettings(raw: string | undefined): TestSettings {
  if (!isTestEnvironment() || !raw) return defaultTestSettings;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return defaultTestSettings;
  }

  if (typeof parsed !== 'object' || parsed === null) return defaultTestSettings;

  const candidate = parsed as Partial<Record<keyof TestSettings, unknown>>;
  const bool = (value: unknown, fallback: boolean) =>
    typeof value === 'boolean' ? value : fallback;
  const allowed = (value: unknown, options: string[]) =>
    typeof value === 'string' && options.includes(value) ? value : '';

  return {
    displayMfa: bool(candidate.displayMfa, defaultTestSettings.displayMfa),
    prefillMfa: bool(candidate.prefillMfa, defaultTestSettings.prefillMfa),
    sendEmails: bool(candidate.sendEmails, defaultTestSettings.sendEmails),
    sendSms: bool(candidate.sendSms, defaultTestSettings.sendSms),
    email: allowed(candidate.email, emailOptions),
    mobile: allowed(candidate.mobile, mobileOptions),
  };
}

export const serialiseTestSettings = (settings: TestSettings): string =>
  JSON.stringify(settings);
