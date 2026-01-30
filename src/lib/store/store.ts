import { createStore as createZustandStore } from 'zustand/vanilla';
import { initialAlertsState, createAlertsSlice } from './slices/alertsSlice';

// Slices
import { initialSignInState, createSignInSlice } from './slices/signInSlice';
import { initialSignUpState, createSignUpSlice } from './slices/signUpSlice';
import { initialSelfServiceState, createSelfServiceSlice } from './slices/selfServiceSlice';

// DTO
import type { AlertsState, AlertsActions, AlertsSlice } from './slices/alertsSlice';
import type { SignInState, SignInActions, SignInSlice } from './slices/signInSlice';
import type { SignUpState, SignUpActions, SignUpSlice } from './slices/signUpSlice';
import type { SelfServiceState, SelfServiceActions, SelfServiceSlice } from './slices/selfServiceSlice';

type StoreState =  AlertsState & SignInState & SignUpState & SelfServiceState;
type StoreActions = AlertsActions & SignInActions& SignUpActions & SelfServiceActions;

export interface StoreProps {}

export type Store = StoreState & StoreActions

const defaultState: StoreState = {
  ...initialAlertsState,
  ...initialSignInState,
  ...initialSignUpState,
  ...initialSelfServiceState,
};

const defaultProps: StoreProps = {};

export const initStore = (initProps?: Partial<StoreProps>): StoreState => {
  return {
    ...defaultState,
    ...defaultProps,
    ...initProps,
  };
};

export const createStore = (initState: StoreState = defaultState) => {
  return createZustandStore<Store>()((set, get, store) => ({
    ...createAlertsSlice(set, get, store),
    ...createSignInSlice(set, get, store),
    ...createSignUpSlice(set, get, store),
    ...createSelfServiceSlice(set, get, store),
    ...initState,
  }));
};