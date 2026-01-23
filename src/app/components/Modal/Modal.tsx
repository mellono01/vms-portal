import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
}) => {
  const handleClose = React.useCallback((_event?: any, _reason?: string) => {
    // Clear focus before closing to prevent aria-hidden warning
    if (document.activeElement && 'blur' in document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
    
    // Small delay to ensure blur happens before modal closes
    setTimeout(() => {
      onClose();
    }, 0);
  }, [onClose]);

  const handleCloseButtonClick = React.useCallback(() => {
    handleClose();
  }, [handleClose]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '200px',
        }
      }}
    >
      {title && (
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={handleCloseButtonClick}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      
      <DialogContent sx={{ p: 2 }}>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ p: 2, pt: 0 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
