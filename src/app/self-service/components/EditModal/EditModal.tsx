import React from 'react';
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs';

import { 
  Button, 
  Typography, 
  Box,
  TextField, 
  Grid2 as Grid, 
  CircularProgress, 
  Divider
} from '@mui/material';

import {
  ChevronRight,
} from '@mui/icons-material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useStore } from '@/lib/providers/storeProvider';

// Components
import { Modal } from '@/app/components/Modal';
import { ClearanceCard } from '../ClearanceCard';

// Helpers
import {
  isWwccRequired,
  isDetailsValid,
  getStatusHelperText,
} from './handlers';

// Constants
import { 
  dateTimeFormat,
  emailRegex, 
  phoneRegex
} from '@/app/lib/constants/constants';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ 
  open, 
  onClose,
}) => {
  const { data: session, status } = useSession();

  const {
    selectedForm,
  } = useStore((store) => store);

  const [originalData, setOriginalData] = React.useState<Form | null>(null);
  const [formData, setFormData] = React.useState<Form | null>(null);

	const [updatingData, setUpdatingData] = React.useState(false);

	const wwccRequired = isWwccRequired(formData?.FormType?.id || '');

  // Initialize form data when modal opens or rowData changes
  React.useEffect(() => {
    if (session?.user) {
      const deepCopiedData = JSON.parse(JSON.stringify(selectedForm));
      setOriginalData(deepCopiedData);
      setFormData(deepCopiedData);
    }
  }, [session?.user, open]);

  const handleCancel = () => {
    onClose();
    // Reset formData to the original deep-copied data
    if (originalData) {
      setFormData(JSON.parse(JSON.stringify(originalData)));
    }
  };

  const handleSave = async () => {
    if (isDetailsValid({ formData, wwccRequired }) && formData && formData._id) {
      console.log('Saving updated details: ', formData);
      let updatedForm = { 
        ...formData,
        WwccNumber: !!formData?.WwccNumber ? formData?.WwccNumber : undefined,
        WwccExpiryDate: !!formData?.WwccExpiryDate ? dayjs(formData?.WwccExpiryDate).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).format(dateTimeFormat) : undefined,
        PhoneNumber: !!formData?.PhoneNumber ? formData?.PhoneNumber.trim() : undefined,
        EmailAddress: !!formData?.EmailAddress ? formData?.EmailAddress.trim() : undefined,
        OrganisationName: !!formData?.OrganisationName ? formData?.OrganisationName.trim() : undefined,
        OrganisationAbn: !!formData?.OrganisationAbn ? formData?.OrganisationAbn.trim() : undefined,
        AuditUserId: 'SelfService',
      };

			if(wwccRequired && ((formData.WwccExpiryDate !== originalData?.WwccExpiryDate) || (formData.WwccNumber !== originalData?.WwccNumber))) {
				updatedForm.FormStatus = {
					id: process.env.VITE_FORM_STATUS_RENEWING ?? '',
					Name: "Renewing"
				}
			}
    }
  };

  const actions = (
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <Button variant="outlined" onClick={handleCancel}>
        Cancel
      </Button>
      <Button 
        variant="contained" 
        onClick={handleSave} 
        disabled={
          JSON.stringify(originalData) === JSON.stringify(formData) ||
          !isDetailsValid({ formData, wwccRequired }) ||
          updatingData
        }
      >
        {
          updatingData
          ? <CircularProgress size={24} color="inherit" />
          : 'Save Changes'
        }
      </Button>
    </Box>
  );

  React.useEffect(() => {
    if(
      formData &&
      (formData?.WwccNumber !== selectedForm?.WwccNumber || 
      formData?.WwccExpiryDate !== selectedForm?.WwccExpiryDate)
    ) {
      setFormData({
        ...formData,
        FormStatus: {
          id: process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING ?? '',
          Name: 'Renewing'
        }
      });
    } else if (
      formData &&
      formData?.WwccNumber === selectedForm?.WwccNumber && 
      formData?.WwccExpiryDate === selectedForm?.WwccExpiryDate
    ) {
      setFormData({
        ...formData,
        FormStatus: {
          id: selectedForm?.FormStatus.id ?? '',
          Name: selectedForm?.FormStatus.Name ?? ''
        }
      });
    }
  }, [formData?.WwccNumber, formData?.WwccExpiryDate]);

  if (formData) {
    return (
      <Modal
        open={open}
        onClose={() => {}} // Disable default close behavior
        title={`Update Clearance Details`}
        actions={actions}
        maxWidth={false}
        showCloseButton={false} // Hide the X button in the title bar
      >
        <Box sx={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent: 'center', mt:3}}>
          <Box sx={{ width: '95%' }}>
            <Grid container columns={4} spacing={2}>
              {
                (formData?.FormType?.id !== process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT && 
                formData?.FormType?.id !== process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT)
                && <>
                  <Grid size={2}>
                    <TextField fullWidth id="wwcc-number-input" label="WWCC Number *" variant="outlined"
                        value={formData?.WwccNumber}
                        onChange={(e)=>{ 
                          setFormData({
                            ...formData, 
                            WwccNumber: e.target.value, 
                          }) 
                        }}
                    />
                  </Grid>
                  <Grid size={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                      sx={{ width: '100%' }}
                        label="WWCC Expiry Date *" 
                        format="DD/MM/YYYY"
                        value={formData?.WwccExpiryDate ? dayjs(formData?.WwccExpiryDate) : null}
                        onChange={(value) => {
                          setFormData({
                            ...formData,
                            WwccExpiryDate: value ? (dayjs(value).isValid() ? dayjs(value).toISOString() : "") : ""
                          })
                        }}
                        slotProps={{
                          textField: {
                            error: (
                              (
                                formData?.WwccExpiryDate === "" || 
                                formData?.WwccExpiryDate === undefined || 
                                formData?.WwccExpiryDate === null
                              ) ||
                              !dayjs(formData?.WwccExpiryDate).isValid()
                            ),
                            helperText: (
                              (
                                formData?.WwccExpiryDate === "" || 
                                formData?.WwccExpiryDate === undefined || 
                                formData?.WwccExpiryDate === null
                              )
                              ? "Required"
                              :  !dayjs(formData?.WwccExpiryDate).isValid()
                                ? "Invalid Date"
                                : ""
                            ),
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              }
              <Grid size={2}>
                <TextField fullWidth id="phone-number-input" label="Phone Number *" variant="outlined"
                    value={formData?.PhoneNumber}
                    onChange={(e)=>{ setFormData({...formData, PhoneNumber: e.target.value})}}
                    error={
                      (formData?.PhoneNumber === "" || formData?.PhoneNumber === undefined) || 
                      !phoneRegex.test(formData?.PhoneNumber)
                    }
                    helperText={
                      (formData?.PhoneNumber === "" || formData?.PhoneNumber === undefined)
                      ? "Required"
                      : !phoneRegex.test(formData?.PhoneNumber)
                        ? "Phone number can only be digits"
                        : ""
                    }
                />
              </Grid>
              <Grid size={2}>
                <TextField fullWidth id="email-address-input" label="Email Address *" variant="outlined"
                    value={formData?.EmailAddress}
                    onChange={(e)=>{ setFormData({...formData, EmailAddress: e.target.value}) }}
                    error={
                      (formData?.EmailAddress === "" || formData?.EmailAddress === undefined) ||
                      !emailRegex.test(formData?.EmailAddress)
                    }
                    helperText={
                      (formData?.EmailAddress === "" || formData?.EmailAddress === undefined) 
                      ? "Required"
                      : !emailRegex.test(formData?.EmailAddress)
                        ? "Please enter a valid email address"
                        : ""
                    }
                />
              </Grid>
              <Grid size={2}>
                <TextField fullWidth id="organisation-name-input" label="Organisation Name" variant="outlined"
                    defaultValue={formData?.OrganisationName}
                    onChange={(e)=>{ setFormData({...formData, OrganisationName: e.target.value}) }}
                />
              </Grid>
              <Grid size={2}>
                <TextField fullWidth id="organisation-abn-input" label="Organisation ABN" variant="outlined"
                    defaultValue={formData?.OrganisationAbn}
                    onChange={(e)=>{ setFormData({...formData, OrganisationAbn: e.target.value}) }}
                />
              </Grid>
            </Grid>
          </Box>
          <Divider flexItem sx={{ mt: 5, mb: 2 }} />
          <Typography variant='h6' sx={{ mt: 2, mb: 2 }}>
            Preview of Changes
          </Typography>
          {
            (formData.WwccExpiryDate !== originalData?.WwccExpiryDate) || (formData.WwccNumber !== originalData?.WwccNumber)
            ? 
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, width: '95%' }}>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {getStatusHelperText(formData, selectedForm)}
                </Typography>
              </Box>
            : null
          }
          <Box sx={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', mt:2, mb:2, width: '95%'}}>
            <ClearanceCard
              key={`edit-modal-clearance-original-${formData._id}`}
              mode='view'
              clearance={selectedForm!}
              expanded={true}
              setExpanded={undefined}
            />
            <ChevronRight sx={{m:2}} />
            <ClearanceCard
              key={`edit-modal-clearance-updated-${formData._id}`}
              mode='view'
              clearance={formData}
              expanded={true}
              setExpanded={undefined}
            />
          </Box>
        </Box>
      </Modal>
    );
  }
};

export default EditModal;
