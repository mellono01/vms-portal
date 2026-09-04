import { StateCreator } from 'zustand';

// DTO
import { Store } from '@/lib/store/store';

export interface TestSettingsState {
  testMfa: string;
}

export interface TestSettingsActions {
  setTestMfa: (testMfa: string) => void;
}

export type TestSettingsSlice = TestSettingsState & TestSettingsActions;

export const initialTestSettingsSlice: TestSettingsState = {
  testMfa: '',
};

export const createTestSettingsSlice: StateCreator<Store, [], [], TestSettingsSlice> = set => ({
  ...initialTestSettingsSlice,
  setTestMfa: (testMfa) => set((state) => ({ ...state, testMfa })),
});
