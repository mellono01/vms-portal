import { createStore as createZustandStore } from 'zustand/vanilla';
import { initialAlertsState, createAlertsSlice } from './slices/alertsSlice';

// Slices
import { initialSelfServiceState, createSelfServiceSlice } from './slices/selfServiceSlice';

// DTO
import type { AlertsState, AlertsActions, AlertsSlice } from './slices/alertsSlice';
import type { SelfServiceState, SelfServiceActions, SelfServiceSlice } from './slices/selfServiceSlice';

type StoreState =  AlertsState & SelfServiceState;
type StoreActions = AlertsActions & SelfServiceActions;

export interface StoreProps {}

export type Store = StoreState & StoreActions

const defaultState: StoreState = {
  ...initialAlertsState,
  ...initialSelfServiceState
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
    ...createSelfServiceSlice(set, get, store),
    ...initState,
  }));
};