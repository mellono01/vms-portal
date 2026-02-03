import { useState } from 'react';

import {
  Box,
  Button,
	CircularProgress,
  Modal,
  Typography
} from '@mui/material';

// DTO
import type { Form } from '@/lib/dto/Form.dto';
// import type { Form as ImportedForm } from '@/dto/Form.dto';
// type Form = Omit<ImportedForm, '_id'> & { _id: string };

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: {xs:'90%', md:'70%', lg:'60%', xl:'50%'},
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Form | null;
  getUser: () => Promise<any[]>;
  setLoadingUserData: (loading: boolean) => void;
}

const DeleteModal = ({
	open,
  setOpen,
  data,
  getUser,
  setLoadingUserData,
}: Props) => {
  const [closingClearance, setClosingClearance] = useState(false);

  const closeClearance = () => {
    const updatedForm = {
      ...data,
      FormStatus: {
        id: process.env.VITE_FORM_STATUS_CLOSED,
        Name: "Closed"
      },
      AuditUserId: "SelfService",
    }
    
    setClosingClearance(true);
  }

  if(data !== null) {
    return (
      <Modal
        open={open}
        onClose={() => {setOpen(!open)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
                Are you sure you want to delete this clearance?
            </Typography>
            <Box sx={{width:'100%', display:'flex', justifyContent:'start', mt:3}}>
              <Typography variant="body1">
                You will no longer be able to work at any CEDoW sites using this clearance. We will no longer contact you about this clearance.
              </Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-between', mt:4}}>
                <Button 
                    variant="contained" 
                    sx={{backgroundColor:'lightGrey', color: 'black', '&:hover':{color:'white'}, mr:1}}
                    disabled={closingClearance}
                    onClick={() => setOpen(!open)}
                >
                  No, don't delete this clearance
                </Button>
                <Button 
                    variant="contained" 
                    color={'warning'}
                    disabled={closingClearance}
                    onClick={() => {closeClearance()}}
                >
                    {closingClearance ? <CircularProgress size={20}/> : 'Yes, delete this clearance'}
                </Button>
            </Box>
        </Box>
    </Modal>
    );
  }
  return null;
}

export default DeleteModal;