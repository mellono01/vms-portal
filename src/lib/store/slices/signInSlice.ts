import { StateCreator } from 'zustand';

// DTO
import { Store } from '@/lib/store/store';

export interface SignInDetails {
  CedowToken: string | null;
  LastName: string | null;
}
export interface SignInState {
  signInDetails: SignInDetails | null;
}

export interface SignInActions {
  setSignInDetails: (signInDetails: SignInDetails) => void;
}

export type SignInSlice = SignInState & SignInActions;

export const initialSignInState: SignInState = {
  signInDetails: null,
};

export const createSignInSlice: StateCreator<Store, [], [], SignInSlice> = set => ({
  ...initialSignInState,
  setSignInDetails: (signInDetails) => set({ signInDetails }),
});