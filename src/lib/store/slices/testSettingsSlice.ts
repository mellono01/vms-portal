import { StateCreator } from 'zustand';

// DTO
import { Store } from '@/lib/store/store';

export interface TestSettingsState {
  displayMfa: boolean;
  sendEmails: boolean;
  sendSms: boolean;
  email: string;
  mobile: string;
  testMfa: string;
  emailOptions: string[];
  mobileOptions: string[];
}

export interface TestSettingsActions {
  setDisplayMfa: (displayMfa: boolean) => void;
  setSendEmails: (sendEmails: boolean) => void;
  setSendSms: (sendSms: boolean) => void;
  setEmail: (email: string) => void;
  setMobile: (mobile: string) => void;
  setTestMfa: (testMfa: string) => void;
}

export type TestSettingsSlice = TestSettingsState & TestSettingsActions;

export const initialTestSettingsSlice: TestSettingsState = {
  displayMfa: true,
  sendEmails: false,
  sendSms: false,
  email: '',
  mobile: '',
  testMfa: '',
  emailOptions: process.env.NEXT_PUBLIC_TEST_EMAIL_ADDRESSES?.split(',') || [],
  mobileOptions: process.env.NEXT_PUBLIC_TEST_MOBILE_NUMBERS?.split(',') || [],
};

export const createTestSettingsSlice: StateCreator<Store, [], [], TestSettingsSlice> = set => ({
  ...initialTestSettingsSlice,
  setDisplayMfa: (displayMfa) => set((state) => ({ ...state, displayMfa })),
  setSendEmails: (sendEmails) => set((state) => ({ ...state, sendEmails })),
  setSendSms: (sendSms) => set((state) => ({ ...state, sendSms })),
  setEmail: (email) => set((state) => ({ ...state, email })),
  setMobile: (mobile) => set((state) => ({ ...state, mobile })),
  setTestMfa: (testMfa) => set((state) => ({ ...state, testMfa })),
});