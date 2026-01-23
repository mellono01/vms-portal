import { StateCreator } from 'zustand';

// DTO
import { Store } from '@/lib/store/store';
import { EntityForm } from '@/lib/dto/EntityForm.dto';
import { Form } from '@/lib/dto/Form.dto';

export interface SelfServiceState {
  userData: EntityForm | null;
  selectedForm: Form | null;
}

export interface SelfServiceActions {
  setUserData: (userData: EntityForm) => void;
  setSelectedForm: (form: Form) => void;
}

export type SelfServiceSlice = SelfServiceState & SelfServiceActions;

export const initialSelfServiceState: SelfServiceState = {
  userData: null,
  selectedForm: null,
};

export const createSelfServiceSlice: StateCreator<Store, [], [], SelfServiceSlice> = set => ({
  ...initialSelfServiceState,
  setUserData: (userData) => set({ userData }),
  setSelectedForm: (form) => set({ selectedForm: form }),
});