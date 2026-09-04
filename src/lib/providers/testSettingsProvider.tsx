'use client';

import { createContext, useCallback, useContext, useRef, useState, useTransition } from 'react';

import { setTestSettings as persistTestSettings } from '@/app/actions/setTestSettings';
import { defaultTestSettings } from '@/lib/testSettings/testSettings';

// DTO
import type { TestSettings } from '@/lib/testSettings/testSettings';

interface TestSettingsContextValue {
  settings: TestSettings;
  /** Apply a partial change optimistically and persist it to the cookie. */
  updateSettings: (patch: Partial<TestSettings>) => void;
  saving: boolean;
}

const TestSettingsContext = createContext<TestSettingsContextValue | null>(null);

export const TestSettingsProvider = ({
  children,
  settings: initialSettings,
}: React.PropsWithChildren<{ settings: TestSettings }>) => {
  // Seeded from the cookie on the server, so the first render already has the
  // real values and there is nothing to rehydrate on the client.
  const [settings, setSettings] = useState<TestSettings>(initialSettings);
  const [saving, startTransition] = useTransition();

  // Mirrors `settings` so `updateSettings` can read the current value without
  // taking it as a dependency, and without computing the next value inside the
  // state updater (which React runs during render).
  const settingsRef = useRef<TestSettings>(initialSettings);

  const applySettings = useCallback((next: TestSettings) => {
    settingsRef.current = next;
    setSettings(next);
  }, []);

  const updateSettings = useCallback((patch: Partial<TestSettings>) => {
    const next = { ...settingsRef.current, ...patch };
    applySettings(next);

    startTransition(async () => {
      // The action re-validates and returns what was actually stored, so the
      // UI settles on the persisted value rather than the optimistic one.
      const stored = await persistTestSettings(next);
      applySettings(stored);
    });
  }, [applySettings]);

  return (
    <TestSettingsContext.Provider value={{ settings, updateSettings, saving }}>
      {children}
    </TestSettingsContext.Provider>
  );
};

export const useTestSettings = (): TestSettingsContextValue => {
  const context = useContext(TestSettingsContext);

  if (!context) {
    throw new Error('useTestSettings must be used within TestSettingsProvider');
  }

  return context;
};

export { defaultTestSettings };
