import { StateCreator } from 'zustand';

// DTO
import { Store } from '@/lib/store/store';
import { EntityForm } from '@/lib/dto/EntityForm.dto';
import { Form } from '@/lib/dto/Form.dto';
import { Location } from '@/lib/dto/Location.dto';

export interface SelfServiceState {
  userData: EntityForm | null;
  fetchingUserData: boolean;
  selectedForm: Form | null;
  locations: Location[] | null;
  fetchingLocations: boolean;
}

export interface SelfServiceActions {
  setUserData: (userData: EntityForm) => void;
  setFetchingUserData: (fetching: boolean) => void;
  setSelectedForm: (form: Form) => void;
  setLocations: (locations: Location[]) => void;
  setFetchingLocations: (fetching: boolean) => void;
}

export type SelfServiceSlice = SelfServiceState & SelfServiceActions;

export const initialSelfServiceState: SelfServiceState = {
  userData: null,
  fetchingUserData: false,
  selectedForm: null,
  locations: null,
  fetchingLocations: false,
};

export const createSelfServiceSlice: StateCreator<Store, [], [], SelfServiceSlice> = set => ({
  ...initialSelfServiceState,
  setUserData: (userData) => set({ userData }),
  setFetchingUserData: (fetching) => set({ fetchingUserData: fetching }),
  setSelectedForm: (form) => set({ selectedForm: form }),
  setLocations: (locations) => set({ locations }),
  setFetchingLocations: (fetching) => set({ fetchingLocations: fetching }),
});