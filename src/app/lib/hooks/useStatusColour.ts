import { useTheme } from '@mui/material';
import { StatusColours as statusColors } from '@/app/lib/constants/Statuses';

export function useStatusColour() {
  const theme = useTheme();
  
  return (statusId: string): string => {
    switch (statusId) {
      case process.env.NEXT_PUBLIC_FORM_STATUS_CLEARED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18:
        return theme.palette.statusColors?.green || statusColors.green;
      case process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING:
      case process.env.NEXT_PUBLIC_FORM_STATUS_INPROGRESS:
        return theme.palette.statusColors?.yellow || statusColors.yellow;
      case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING:
      case process.env.NEXT_PUBLIC_FORM_STATUS_DECLINED:
        return theme.palette.statusColors?.orange || statusColors.orange;
      case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_BARRED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG:
        return theme.palette.statusColors?.red || statusColors.red;
      default:
        return 'white';
    }
  };
}

export function useValidatedColour() {
  return (validated: boolean, signedOut: boolean): string => {
    switch (validated) {
      case true:
        // return '#bff5ca';
        if (!signedOut) {
          return '#9BF2AD';
        }
        return 'white';
      case false:
        return '#fcaeae';
      default:
        return 'white';
    }
  };
}