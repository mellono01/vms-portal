"use client";

import React from "react";
import { 
  Alert,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon
} from "@mui/icons-material";

import { useStore } from '@/lib/providers/storeProvider';

export default function PageWrapper({
  title,
  component
}: {
  title?: string;
  component: JSX.Element;
}): JSX.Element {
  const {alerts, removeAlert} = useStore((state) => ({
    alerts: state.alerts,
    removeAlert: state.removeAlert
  }));

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2}}>
      { alerts.map((alert, index) => {
        return (
          <Alert 
            key={index} 
            severity={alert.severity}
            variant='filled'
            sx={{width: '95%', m:1}}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    removeAlert(alert.id);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        )
      })}
      {
        title && (
          <Typography variant="h4" sx={{m:3}}>{title}</Typography>
        )
      }
      {component}
    </Box>
  );
}
