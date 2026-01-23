'use client';

import { createContext, useContext, useRef } from 'react';
import { type StoreApi, useStore as useZustandStore } from 'zustand';

import { createStore, initStore } from '@/lib/store/store';

// DTO
import type { Store, StoreProps } from '@/lib/store/store';

export const StoreContext = createContext<StoreApi<Store> | null>(null);

type StoreProviderProps = React.PropsWithChildren<StoreProps>

export const StoreProvider = ({ children, ...props }: StoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store>>();
  if (!storeRef.current) storeRef.current = createStore(initStore(props));

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: Store) => T): T => {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    throw new Error('useStore must be use within StoreProvider');
  }

  return useZustandStore(storeContext, selector);
};