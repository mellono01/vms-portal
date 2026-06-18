'use client'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'

import { 
  Box, 
  Button, 
  Tooltip,
  Typography 
} from "@mui/material";

import { 
  Delete,
  Edit,
  Upload as Upgrade,
} from "@mui/icons-material";

// DTO
import type { Form } from '@/lib/dto/Form.dto';

export function ActionButtons({
  clearance,
  setSelectedForm,
  setEditDetailsOpen,
  setOpenDeleteModal,
}: {
  clearance: Form,
  setSelectedForm: (form: Form) => void,
  setEditDetailsOpen: (open: boolean) => void,
  setOpenDeleteModal: (open: boolean) => void,
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if(session && session.user) {
    const sessionForm = session.user.details?.Forms?.find((form: any) => form._id === clearance._id);
    return (
      <>
        <Box sx={{display:'flex', flexDirection:'row', justifyContent:'start', width:'100%', mb:1}}>
          <Tooltip 
            title={'Delete Clearance'} 
            placement="top" 
            slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
          >
            <Button 
              variant='text' 
              sx={{textTransform: 'none'}}
              onClick={() => {
                setSelectedForm(clearance); 
                setOpenDeleteModal(true);
              }}
            >
              <Delete/>
              <Typography variant='body1' sx={{ml:0.5}}>
                Delete
              </Typography>
            </Button>
          </Tooltip>
        </Box>
        <Box sx={{display:'flex', flexDirection:'row', justifyContent:'end', width:'100%', mb:1}}>
          {
            (
              clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT ||
              clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT
            ) && 
            <Tooltip 
              title={'Upgrade Clearance'} 
              placement="top" 
              slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
            >
              <Button 
                variant='text' 
                sx={{textTransform: 'none'}}
                onClick={() => {
                  console.log('Selected Form for Upgrade:', clearance);
                  // setSelectedForm(clearance); 
                  console.log('Navigating to upgrade page with form ref:', sessionForm);
                  router.push(`/induction/upgrade?form=${sessionForm?.ref}`);
                }}
              >
                <Upgrade/>
                <Typography variant='body1' sx={{ml:0.5}}>
                  Upgrade
                </Typography>
              </Button>
            </Tooltip>
          }
          
          <Tooltip 
            title={'Edit Clearance'} 
            placement="top" 
            slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
          >
            <Button 
              variant='text' 
              sx={{textTransform: 'none'}}
              onClick={() => {setSelectedForm(clearance); setEditDetailsOpen(true)}}
            >
              <Edit/>
              <Typography variant='body1' sx={{ml:0.5}}>
                Edit
              </Typography>
            </Button>
          </Tooltip>
        </Box>
      </>
    )
  }; 
}