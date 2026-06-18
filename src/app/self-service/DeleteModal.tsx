'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
	CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { 
  ChevronRight,
  ExpandMore as Expand
} from '@mui/icons-material';

// Store
import { useStore } from '@/lib/providers/storeProvider';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

// Components
import { Modal } from '@/app/components/Modal';
import { ClearanceCard } from './components/ClearanceCard/ClearanceCard';

// API
import putForm from '@/lib/api/requests/putForm';
import getEntityForms from '@/lib/api/requests/getEntityForms';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DeleteModal = ({
	open,
  setOpen,
}: Props) => {
  const { data: session } = useSession();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    selectedForm,
    setUserData,
    setFetchingUserData,
  } = useStore((store) => store);

  const [updatingData, setUpdatingData] = useState(false);
  const [updatedForm, setUpdatedForm] = useState<Form | null>(null);
  
  // Initialize form data when modal opens or rowData changes
  useEffect(() => {
    if (session?.user) {
      const deepCopiedData = JSON.parse(JSON.stringify(selectedForm));
      setUpdatedForm({
        ...deepCopiedData,
        FormStatus: {
          id: process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED,
          Name: "Closed"
        },
        AuditUserId: "SelfService",
      });
    }
  }, [session?.user, open]);

  console.log('updatedForm in DeleteModal:', updatedForm);

  const closeClearance = async () => {
    const updatedForm = {
      ...selectedForm,
      FormStatus: {
        id: process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED,
        Name: "Closed"
      },
      AuditUserId: "SelfService",
    }
    
    setUpdatingData(true);

    // Call API to update form details
    await putForm({ data: updatedForm })
    .then(async (res) => {
      console.log('Form updated successfully:', res);
      setUpdatingData(false);

      setFetchingUserData(true);
      await getEntityForms({ 
        CedowToken: session?.user.details?.CedowToken ?? '', 
        LastName: session?.user.details?.LastName ?? '' 
      }).then((data) => {
        setFetchingUserData(false);
        console.log('Updated forms:', data);
        setUserData(data[0]);
        setOpen(false);
      }).catch((err) => {
        setFetchingUserData(false);
        console.error('Error fetching updated forms:', err);
      });
    });
  }

  const actions = (
    <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1, width: '100%' }}>
      <Button 
        variant="contained" 
        color="secondary"
        onClick={closeClearance} 
        sx={{textTransform: 'none'}}
        // disabled={}
      >
        {
          updatingData
          ? <CircularProgress size={24} color="inherit" />
          : 'Yes, close this clearance'
        }
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => {setOpen(false)}}
        sx={{textTransform: 'none'}}
      >
        No, don't close this clearance
      </Button>
    </Box>
  );

  if(selectedForm !== null) {
    return (
      <Modal
        open={open}
        onClose={() => setOpen(false)} // Disable default close behavior
        title={`Delete Clearance`}
        actions={actions}
        maxWidth={'md'}
        showCloseButton={false} // Hide the X button in the title bar
      >
        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent: 'center'}}>
          <Typography variant="h6" align="center">
            Are you sure you want to delete this clearance?
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            You will no longer be able to use this clearance at any CEDoW sites and will not receive notifications about this clearance.
          </Typography>
          {/* <List sx={{ listStyleType: 'disc', p:2}}>
            <ListItem sx={{ display: 'list-item', p:0, pl: 2, m:0 }}>
              <ListItemText primary="You will no longer be able to use this clearance at any CEDoW sites." />
            </ListItem>
            <ListItem sx={{ display: 'list-item', p:0, pl: 2, m:0 }}>
              <ListItemText primary="You will no longer receive notifications from us about this clearance." />
            </ListItem>
          </List> */}
          <Box sx={{display:'flex', flexDirection:{xs:'column', sm:'row'}, alignItems:'center', justifyContent: 'center', mt: 3, mb:3}}>
            <ClearanceCard
              key={`delete-modal-clearance-updated-${selectedForm._id}`}
              mode='view'
              clearance={updatedForm}
              expanded={true}
              setExpanded={undefined}
              disableActions={true}
            />
          </Box>
        </Box>
      </Modal>
    );
  }
  return null;
}

export default DeleteModal;