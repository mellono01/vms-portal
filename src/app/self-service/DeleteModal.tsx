'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'

import {
  Box,
  Button,
	CircularProgress,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

// Store
import { useStore } from '@/lib/providers/storeProvider';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

// Components
import { Modal } from '@/app/components/Modal';
import { ClearanceCard } from './components/ClearanceCard/ClearanceCard';

// API
import putForm, { PutForm } from '@/lib/api/requests/putForm';
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

  const closeClearance = async () => {
    if(!selectedForm) return;
    const updatedForm: PutForm = {
      ...selectedForm,
      _id: selectedForm._id ?? '',
      CedowToken: selectedForm.CedowToken ?? '',
      FormStatus: {
        id: process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED ?? '',
        Name: "Closed"
      },
      AuditUserId: "SelfService",
    }
    
    setUpdatingData(true);

    // Call API to update form details
    await putForm({ data: updatedForm })
    .then(async (res) => {
      console.log('Form updated successfully', res);
      setUpdatingData(false);

      setFetchingUserData(true);
      await getEntityForms().then((data) => {
        setFetchingUserData(false);
        console.log('Updated forms fetched successfully', data);
        setUserData(data[0]);
        setOpen(false);
      }).catch((err) => {
        setFetchingUserData(false);
        console.error('Error fetching updated forms', err);
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
        title={`Are you sure you want to delete this clearance?`}
        actions={actions}
        maxWidth={'md'}
        showCloseButton={false} // Hide the X button in the title bar
      >
        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent: 'center'}}>
          <Typography variant="body1" align="center">
            You will no longer be able to use this clearance at any CEDoW sites and will not receive notifications about this clearance.
          </Typography>
          <Box sx={{display:'flex', flexDirection:{xs:'column', sm:'row'}, alignItems:'center', justifyContent: 'center', mt: 3, mb:3}}>
            {updatedForm && (
              <ClearanceCard
                key={`delete-modal-clearance-updated-${selectedForm._id}`}
                mode='view'
                clearance={updatedForm}
                disableActions={true}
                setSelectedForm={() => {}}
                setEditDetailsOpen={() => {}}
                setOpenDeleteModal={() => {}}
              />
            )}
          </Box>
        </Box>
      </Modal>
    );
  }
  return null;
}

export default DeleteModal;