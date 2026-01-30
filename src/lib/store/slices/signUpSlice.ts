import { StateCreator } from 'zustand';

// DTO
import { Store } from '@/lib/store/store';

export interface SignUpDetails {
  FirstName: string | null;
  LastName: string | null;
  Email: string | null;
}

export interface SignUpState {
  signUpDetails: SignUpDetails | null;
}

export interface SignUpActions {
  setSignUpDetails: (signUpDetails: SignUpDetails) => void;
}

export type SignUpSlice = SignUpState & SignUpActions;

export const initialSignUpState: SignUpState = {
  signUpDetails: null,
};

export const createSignUpSlice: StateCreator<Store, [], [], SignUpSlice> = set => ({
  ...initialSignUpState,
  setSignUpDetails: (signUpDetails) => set({ signUpDetails }),
});