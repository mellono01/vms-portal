import { StateCreator } from 'zustand';

export interface Alert {
    id: string;
    open: boolean;
    message: string;
    severity: "error" | "warning" | "info" | "success";
}

export interface AlertsState {
    alerts: Alert[];
}
  
export interface AlertsActions {
    addAlert(alert: Alert): void;
    removeAlert(id: string): void;
}

export type AlertsSlice = AlertsState & AlertsActions

export const initialAlertsState: AlertsState = {
  alerts: []
};

export const createAlertsSlice: StateCreator<AlertsSlice> = set => ({
  ...initialAlertsState,
  addAlert: (alert) => {
    console.log(alert); 
    set((state) => ({ alerts: [...state.alerts, alert] }))
  },
  removeAlert: (id) => {
    set((state) => ({ alerts: state.alerts.filter(alert => alert.id !== id) }))
  }
});