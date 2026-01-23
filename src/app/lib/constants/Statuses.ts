export const StatusColours = {
      orange: "#f09b4d",
      green: "#26d148",
      red:  "#f55f5f",
      yellow: "#f2d55e",
  }

export const statuses = [
        {
            id: process.env.VITE_FORM_STATUS_CLEARED,
            color: StatusColours.green
        },
        {
            id: process.env.VITE_FORM_STATUS_UNDER18,
            color: StatusColours.green
        },
        {
            id: process.env.VITE_FORM_STATUS_APPLIED,
            color: StatusColours.yellow
        },
        {
            id: process.env.VITE_FORM_STATUS_INPROGRESS,
            color: StatusColours.yellow
        },
        {
            id: process.env.VITE_FORM_STATUS_RENEWING,
            color: StatusColours.yellow
        },
        {
            id: process.env.VITE_FORM_STATUS_DECLINED,
            color: StatusColours.orange
        },
        {
            id: process.env.VITE_FORM_STATUS_EXPIRING,
            color: StatusColours.orange
        },
        {
            id: process.env.VITE_FORM_STATUS_INTERIMBARRED,
            color: StatusColours.red
        },
        {
            id: process.env.VITE_FORM_STATUS_EXPIRED,
            color: StatusColours.red
        },
        {
            id: process.env.VITE_FORM_STATUS_CLOSED,
            color: StatusColours.red
        },
        {
            id: process.env.VITE_FORM_STATUS_CLOSEDBYOCG,
            color: StatusColours.red
        },
        {
            id: process.env.VITE_FORM_STATUS_BARRED,
            color: StatusColours.red
        }
    ]