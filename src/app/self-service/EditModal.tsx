import React from 'react';
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs';

import { 
  Button, 
  Typography, 
  Box,
  TextField, 
  Grid2 as Grid, 
  CircularProgress 
} from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Components
import { Modal } from '@/app/components/Modal';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

const dateTimeFormat = "YYYY-MM-DDTHH:mm:ss.SSS+00:00";
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const wwccRegex = /^WWC\d{7}[EV]$/;
const phoneRegex = /^[0-9]*$/;

interface EditModalProps {
  open: boolean;
  onClose: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ 
  open, 
  onClose,
}) => {
  const { data: session, status } = useSession();
  const [originalData, setOriginalData] = React.useState<Form | null>(null);
  const [formData, setFormData] = React.useState<Form | null>(null);

	const [updatingData, setUpdatingData] = React.useState(false);

	const wwccRequired = ( 
    formData?.FormType?.id !== process.env.VITE_FORM_TYPES_VOLUNTEEREXEMPT &&
    formData?.FormType?.id !== process.env.VITE_FORM_TYPES_CONTRACTOREXEMPT &&
    formData?.FormStatus?.id !== process.env.VITE_FORM_STATUS_UNDER18
  ) ? true : false;

  const validateDetails = () => {
    let validPhone = phoneRegex.test(formData?.PhoneNumber || '');
    let validEmail = emailRegex.test(formData?.EmailAddress || '');
    let validWWCC = wwccRegex.test(formData?.WwccNumber || '');
    let validWWCCExpiry = (
      formData?.WwccExpiryDate !== undefined && 
      formData?.WwccExpiryDate !== null && 
      formData?.WwccExpiryDate !== ""
    ) ? true : false;

    if (wwccRequired && validPhone && validEmail && validWWCC && validWWCCExpiry) { // Clearance requires WWCC, check for it
			return true;
		} else if (!wwccRequired && validPhone && validEmail ) { // Clearance does not require WWCC, dont check for it
			return true;
    } else {
			return false;
		}
	}

  // Initialize form data when modal opens or rowData changes
  React.useEffect(() => {
    if (session?.user) {
      const deepCopiedData = JSON.parse(JSON.stringify(session.user));
      setOriginalData(deepCopiedData);
      setFormData(deepCopiedData);
    }
  }, [session?.user, open]);
  console.log('Form Data in Edit Modal: ', formData);

  const handleCancel = () => {
    // Reset formData to the original deep-copied data
    if (originalData) {
      setFormData(JSON.parse(JSON.stringify(originalData)));
    }
    onClose();
  };

  const handleSave = async () => {
    if (validateDetails() && formData && formData._id) {
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
					id: process.env.VITE_FORM_STATUS_RENEWING,
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
          !validateDetails() ||
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

  if (!formData) return null;

  return (
    <Modal
      open={open}
      onClose={() => {}} // Disable default close behavior
      title={`Update Clearance Details`}
      actions={actions}
      maxWidth={false}
      showCloseButton={false} // Hide the X button in the title bar
    >
      <Box sx={{width:'100%', display:'flex', justifyContent:'center', mt:3}}>
        <Grid container columns={4} spacing={2}>
          {
            formData?.FormType?.id !== process.env.VITE_FORM_TYPES_VOLUNEEREXEMPT || 
            formData?.FormType?.id === process.env.VITE_FORM_TYPES_CONTRACTOREXEMPT
            ? <>
              <Grid size={2}>
                <TextField fullWidth id="wwcc-number-input" label="WWCC Number *" variant="outlined"
                    value={formData?.WwccNumber}
                    onChange={(e)=>{ setFormData({...formData, WwccNumber: e.target.value}) }}
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
            </> : null
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
          {
            (formData.WwccExpiryDate !== originalData?.WwccExpiryDate) || (formData.WwccNumber !== originalData?.WwccNumber)
            ? <Grid size={4} sx={{ mt: 2 }}>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {`Updating your WWCC Number or WWCC Expiry Date will set your clearance to "Renewing" status until your updated details are reviewed by our team.
                  If your WWCC is still valid, you will be able to continue using your clearance while we review your updated details.
                  If your WWCC has expired, your clearance cannot be used until your updated details have been reviewed and approved.`}
                </Typography>
              </Box>
            </Grid> 
            : null
          }
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditModal;
