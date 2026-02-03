'use client'

import React from "react";
import { useRouter } from 'next/navigation';

import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  Collapse, 
  Divider, 
  Grid2 as Grid, 
  IconButton, 
  TextField, 
  Tooltip,
  Typography 
} from "@mui/material";

import { 
  MoreVert, 
  CheckCircle, 
  Dangerous, 
  ErrorOutline, 
  Error,
  HelpOutline, 
  Warning, 
  ExpandLess, 
  ExpandMore,
  Add,
  Circle
} from "@mui/icons-material";

// DTO
import type { Form } from '@/lib/dto/Form.dto';

// Hooks
import { useStatusColour } from '@/app/lib/hooks/useStatusColour';

export function ClearanceCard({
  mode,
  clearance,
  expanded,
  setExpanded,
  setSelectedForm,
  handleOpenActionsMenu
}: {
  mode: 'view' | 'edit';
  clearance: Form;
  expanded: boolean;
  setExpanded?: (id: string) => void;
  setSelectedForm?: (form: Form) => void;
  handleOpenActionsMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCloseActionsMenu?: () => void;
}) {
console.log('[ClearanceCard] Clearance Data:', clearance);

  const getCardColor = useStatusColour();
  const cardColour = getCardColor(clearance.FormStatus?.id);

  function getExpiryDateFormat(expiryDate: Date | null, statusId: string) {
		if(
			statusId === process.env.NEXT_PUBLIC_FORM_STATUS_BARRED || 
			statusId === process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED || 
			statusId === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED || 
			statusId === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG ||
			expiryDate === null
		) {
			return null;
		} else {
			return `${dayjs(expiryDate).format('DD/MM/YYYY')}`;
		}
	}

  function getStatusTooltipText(statusId: string) {
    switch(statusId) {
      case process.env.NEXT_PUBLIC_FORM_STATUS_CLEARED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18:
        return 'This clearance is valid and can be used at the locations listed below.';
      case process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED:
        return 'This clearance is currently being processed by our team. Once completed, you will be notified via email with further information and instructions.';
      case process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING:
        return 'This clearance is currently being renewed and is waiting review by our team. You will be notified via email with further information and instructions once complete.';
      case process.env.NEXT_PUBLIC_FORM_STATUS_INPROGRESS:
        return 'This clearance is currently in progress';
      case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING:
        return 'This clearance will expire soon. You will need to renew this clearance before it expires if you wish to continue using it.';
      case process.env.NEXT_PUBLIC_FORM_STATUS_DECLINED:
        return 'This clearance has been declined and cannot be used. Please contact us for more information.';
      case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED:
        return 'This clearance has been closed and cannot be used. Please contact us for more information.';
      case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED:
        return 'This clearance has expired and cannot be used currently. To continue using this clearance, please renew it.';
      case process.env.NEXT_PUBLIC_FORM_STATUS_BARRED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED:
      case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG:
        return 'This clearance cannot be used. Please contact us for more information.';
      default:
        return '';
    }
  }
  
  return (
    <>
      <Card 
        sx={{
          minWidth: '300px', 
          maxWidth: '450px',
          flex: {
            xs: '1 1 100%', // Full width on small screens
            sm: '0 1 auto'  // Natural width on larger screens
          }
        }}
      >
        <CardHeader 
          title={
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Box sx={{display: 'flex', flexGrow: 1}}>
                <Typography variant="h6">
                  {clearance.FormType.Name.replace(/(?<!^)([A-Z])/g, " $1")}
                </Typography>
              </Box>
              {
                mode==='view' && (
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <IconButton 
                      onClick={(event) => {
                        setSelectedForm?.(clearance); 
                        handleOpenActionsMenu?.(event);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                )
              }
            </Box>
          }
          subheader={
            (
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_STATUS_CLOSED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_BARRED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG
            )
            ? <Typography variant='body2' sx={{color: cardColour}}>
              (This clearance cannot be used)
              </Typography>
            : (
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED
            ) 
            ? <Typography variant='body2' sx={{}}>
              (This clearance is pending review)
              </Typography>
            : null
          }
          avatar={
            (
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLEARED || 
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18 ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_INPROGRESS
            ) ? <CheckCircle sx={{ fontSize: '35px', color: cardColour }} />
            : (
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_DECLINED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED
            ) ? <Error sx={{ fontSize: '35px', color: cardColour }} />
            : (
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_BARRED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED ||
              clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG
            ) ? <Dangerous sx={{ fontSize: '35px', color: cardColour }} />
            : <ErrorOutline />
          }
        />
        <Divider sx={{color: 'darkGrey'}}/>
        <CardContent sx={{display: 'flex', flexDirection:'column', paddingBottom: 0}} >
          <Grid container columns={!expanded ? 4 : 5} spacing={1} sx={{mb:1}}>
            <Grid size={!expanded ? 1 : 2} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
              <Typography 
                variant="body1"
                sx={{mr:0.5}}
              >
                Status:
              </Typography>
            </Grid>
            <Grid size={!expanded ? 3 : 3} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
              <Chip 
                label={
                  <Box sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant='body1'>
                      {clearance.FormStatus.Name}
                    </Typography>
                  </Box>
                } 
                size='medium'
                sx={{backgroundColor: cardColour, color: 'black', height: 24, mr: 0.5}} 
              />
              <Tooltip 
                title={getStatusTooltipText(clearance.FormStatus.id)} 
                placement="top" 
                slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
              >
                <HelpOutline color='primary' sx={{fontSize:'20px'}} />
              </Tooltip>
            </Grid>
            {
              !!getExpiryDateFormat(clearance.ExpiryDate ? new Date(clearance.ExpiryDate) : null, clearance.FormStatus.id)
              ? <>
                <Grid size={!expanded ? 1 : 2}>
                  <Typography variant="body1">
                    Expires:
                  </Typography>
                </Grid>
                <Grid size={!expanded ? 3 : 3} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                  <Typography variant="body1" sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                    {getExpiryDateFormat(clearance.ExpiryDate ? new Date(clearance.ExpiryDate) : null, clearance.FormStatus.id) ? getExpiryDateFormat(clearance.ExpiryDate ? new Date(clearance.ExpiryDate) : null, clearance.FormStatus.id) : null}
                    { 
                      clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING 
                      ? <Warning sx={{fontSize: '20px', color: cardColour, ml: 0.5}}/>
                      : null
                    }
                  </Typography>
                </Grid>
              </>
              : null
            }
            
            <Grid size={!expanded ? 1 : 2}>
              <Typography variant='body1'>Locations: </Typography>
            </Grid>
            <Grid size={!expanded ? 3 : 3}>
              <Typography variant='body1' sx={{whiteSpace: 'pre-line'}}>
                </Typography>
            </Grid>
          </Grid>
          <Collapse in={expanded}>
            <Grid container columns={5} spacing={1}>
              {
                clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER ||
                clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR ||
                clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATEVOLUNTEER ||
                clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATECONTRACTOR
                ?
                <>
                  <Grid size={2}>
                    <Typography variant='body1'>WWCC Number: </Typography>
                  </Grid>
                  <Grid size={3}>
                    {
                      mode === 'edit'
                      ? (
                        <TextField
                          fullWidth
                          variant='standard'
                          size='small'
                          placeholder="e.g. 1234-5678-9012"
                          defaultValue={clearance.WwccNumber ? clearance.WwccNumber : ''}
                          onChange={(e) => {
                            clearance.WwccNumber = e.target.value;
                          }}
                        />
                      )
                      : (
                        <Typography variant='body1'>
                          {clearance.WwccNumber ? clearance.WwccNumber : '(none)'}
                        </Typography>
                      )
                    }
                  </Grid>
                  <Grid size={2}>
                    <Typography variant='body1'>WWCC Expiry{mode==='edit'?'*: ' : ': '}</Typography>
                  </Grid>
                  <Grid size={3}>
                    {
                      mode === 'edit' 
                      ? (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            sx={{width: '100%'}}
                            format="DD/MM/YYYY"
                            value={clearance?.WwccExpiryDate ? dayjs(clearance?.WwccExpiryDate) : null}
                            slotProps={{
                              textField: {
                                variant: 'standard',
                                size: 'small',
                                error: (
                                  (
                                    clearance?.WwccExpiryDate === "" || 
                                    clearance?.WwccExpiryDate === undefined || 
                                    clearance?.WwccExpiryDate === null
                                  ) ||
                                  !dayjs(clearance?.WwccExpiryDate).isValid()
                                ),
                                helperText: (
                                  (
                                    clearance?.WwccExpiryDate === "" || 
                                    clearance?.WwccExpiryDate === undefined || 
                                    clearance?.WwccExpiryDate === null
                                  )
                                  ? "Required"
                                  :  !dayjs(clearance?.WwccExpiryDate).isValid()
                                    ? "Invalid Date"
                                    : ""
                                ),
                              }
                            }}
                          />
                        </LocalizationProvider>
                      )
                      : (
                        <Typography variant='body1' sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                          {clearance.WwccExpiryDate ? dayjs(clearance.WwccExpiryDate).format('DD/MM/YYYY') : '(none)'}
                          { 
                            clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING 
                            ? <Warning sx={{fontSize: '20px', color: cardColour, ml: 0.5}}/>
                            : null
                          }
                        </Typography>
                      )
                    }
                  </Grid>
                </>
                : null
              }
              <Grid size={2}>
                <Typography variant='body1'>Phone Number: </Typography>
              </Grid>
              <Grid size={3}>
                {
                  mode === 'edit'
                  ? (
                    <TextField
                      fullWidth
                      variant='standard'
                      size='small'
                      placeholder="e.g. 0400111222"
                      defaultValue={clearance.PhoneNumber ? clearance.PhoneNumber : ''}
                      onChange={(e) => {
                        // Update the clearance object when the input loses focus
                        clearance.PhoneNumber = e.target.value;
                      }}
                    />
                  )
                  : (
                    <Typography variant='body1'>
                      {clearance.PhoneNumber ? clearance.PhoneNumber : '(none)'}
                    </Typography>
                  )
                }
              </Grid>
              <Grid size={2}>
                <Typography variant='body1'>Email: </Typography>
              </Grid>
              <Grid size={3}>
                {
                  mode === 'edit'
                  ? (
                    <TextField
                      fullWidth
                      variant='standard'
                      size='small'
                      placeholder="e.g. user@example.com"
                      defaultValue={clearance.EmailAddress ? clearance.EmailAddress : ''}
                      onChange={(e) => {
                        // Update the clearance object when the input loses focus
                        clearance.EmailAddress = e.target.value;
                      }}
                    />
                  )
                  : (
                    <Typography variant='body1'>
                      {clearance.EmailAddress ? clearance.EmailAddress : '(none)'}
                    </Typography>
                  )
                }
              </Grid>
              <Grid size={2}>
                <Typography variant='body1'>Organisation: </Typography>
              </Grid>
              <Grid size={3}>
                {
                  mode === 'edit'
                  ? (
                    <TextField
                      fullWidth
                      variant='standard'
                      size='small'
                      placeholder="e.g. Bob's Building"
                      defaultValue={clearance.OrganisationName ? clearance.OrganisationName : ''}
                      onChange={(e) => {
                        // Update the clearance object when the input loses focus
                        clearance.OrganisationName = e.target.value;
                      }}
                    />

                  )
                  : (
                    <Typography variant='body1'>
                      {clearance.OrganisationName ? clearance.OrganisationName : '(none)'}
                    </Typography>
                  )
                }
              </Grid>
              <Grid size={2}>
                <Typography variant='body1'>Organisation ABN: </Typography>
              </Grid>
              <Grid size={3}>
                {
                  mode === 'edit' 
                  ? (
                    <TextField
                      fullWidth
                      variant='standard'
                      size='small'
                      placeholder="e.g. 123456789"
                      defaultValue={clearance.OrganisationAbn ? clearance.OrganisationAbn : ''}
                      onChange={(e) => {
                        // Update the clearance object when the input loses focus
                        clearance.OrganisationAbn = e.target.value;
                      }}
                    />
                  )
                  : (
                    <Typography variant='body1'>
                      {clearance.OrganisationAbn ? clearance.OrganisationAbn : '(none)'}
                    </Typography>
                  )
                }
                
              </Grid>
            </Grid>
          </Collapse>
          <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center', width:'100%', mb:1}}>
            {
              setExpanded && (
                <IconButton
                  onClick={() => clearance._id && setExpanded(clearance._id)}
                >
                  {expanded ? <ExpandLess/> : <ExpandMore/>}
                </IconButton>
              )
            }
          </Box>
        </CardContent>
        <Divider sx={{color: 'darkGrey'}}/>
      </Card>
    </>
  );
}

export const PlaceholderClearance = () => {
  const router = useRouter();
  return (
    <Card 
      key={`selfservice-clearance-placeholder`} 
      variant="outlined"
      sx={{
        minWidth: {
          xs: '356px',
          sm: '450px'
        }, 
        maxWidth: '450px',
        flex: {
          xs: '1 1 100%', // Full width on small screens
          sm: '0 0 auto'  // Natural width on larger screens
        },
        mt:5,
        mb:5,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
            // borderColor: 'primary.main',
        },
        // border: '1px dashed',
        // borderColor: 'grey.400'
      }}
      onClick={() => {
        router.push('/clearance/new');
      }}
    >
      <CardHeader 
        title={
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Box sx={{width: '200px', height: '30px', backgroundColor: 'lightgrey'}}></Box>
          </Box>
        }
        avatar={<Circle sx={{ fontSize: '35px', color: 'lightgrey' }} />}
      />
      <Divider sx={{color: 'darkGrey'}}/>
      <CardContent sx={{display: 'flex', flexDirection:'column', minHeight: '128px', justifyContent: 'center', alignContent: 'center'}} >
        <Grid container columns={5} spacing={1} sx={{ mb:1 }}>
          <Grid size={5} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', flexGrow: 1}}>
            <Add sx={{ fontSize: '28px', color: 'grey', mr: 0.5, height: '100%' }}/>
            <Typography 
                variant="body1"
                sx={{mr:0.5}}
            >
                Add New Clearance
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}