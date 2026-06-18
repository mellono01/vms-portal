'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardHeader, 
  Chip, 
  Collapse,
  Divider, 
  Grid2 as Grid, 
  IconButton, 
  TextField, 
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { 
  CheckCircle, 
  Dangerous, 
  Delete,
  Edit,
  ErrorOutline, 
  Error,
  HelpOutline, 
  Warning, 
  Upload as Upgrade,
  HelpOutlined,
} from "@mui/icons-material";

import { alpha } from '@mui/material/styles';

// Store
import { useStore } from '@/lib/providers/storeProvider';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

// Hooks
import { useStatusColour } from '@/app/lib/hooks/useStatusColour';

// Helper functions
import { 
  getStatusTooltipText, 
  getExpiryDateFormat,
  getCardSubHeaderText,
  getCardAvatar
} from "./helpers";

// Components
import { ClearanceUsage } from "./ClearanceUsage";
import { ActionButtons } from "./ActionButtons";
import { ClearanceCardMobile } from "./ClearanceCardMobile";

function createRippleStyles({
  animationName,
  inset,          // How far outside the element the ripple starts
  borderRadius,
  scaleFrom,
  scaleTo,
  opacityFrom,
  zIndex,
}: {
  animationName: string;
  inset: string;
  borderRadius: string;
  scaleFrom: number;
  scaleTo: number;
  opacityFrom: number;
  zIndex?: number;
}) {
  const baseRippleStyles = {
    position: 'absolute',
    inset,
    borderRadius,
    border: '2px solid',
    borderColor: 'primary.main',
    opacity: 0,
    pointerEvents: 'none',
    ...(zIndex !== undefined ? { zIndex } : {}),
  };

  const rippleStyles: Record<string, unknown> = {
    '&::before': {
      content: '""',
      ...baseRippleStyles,
      animation: `${animationName} 1s ease-out`,
    },
    '&::after': {
      content: '""',
      ...baseRippleStyles,
      animation: `${animationName} 1s ease-out 0.25s`,
    },
    [`@keyframes ${animationName}`]: {
      '0%': { transform: `scale(${scaleFrom})`, opacity: opacityFrom },
      '100%': { transform: `scale(${scaleTo})`, opacity: 0 },
    },
  };

  return rippleStyles;
}

export function ClearanceCard({
  mode,
  disableActions,
  clearance,
  setSelectedForm,
  setEditDetailsOpen,
  setOpenDeleteModal,
}: {
  mode: 'view' | 'edit';
  disableActions: boolean;
  clearance: Form;
  setSelectedForm: (form: Form) => void;
  setEditDetailsOpen: (open: boolean) => void;
  setOpenDeleteModal: (open: boolean) => void;
}) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Store Hooks
  const {
    locations,
  } = useStore((store) => store);

  const getCardColor = useStatusColour();
  const cardColour = getCardColor(clearance.FormStatus?.id);
  const [flashCardRipple, setFlashCardRipple] = useState(false);
  const [flashHelpIcon, setFlashHelpIcon] = useState(false);

  // Collapses
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const onFlashCard = () => {
      setFlashCardRipple(true);
      window.setTimeout(() => {
        setFlashCardRipple(false);
      }, 1100);
    };

    const onFlashHelpIcon = () => {
      setFlashHelpIcon(true);
      window.setTimeout(() => {
        setFlashHelpIcon(false);
      }, 900);
    };

    window.addEventListener('flash-clearance-card', onFlashCard);
    window.addEventListener('flash-clearance-help-icon', onFlashHelpIcon);

    return () => {
      window.removeEventListener('flash-clearance-card', onFlashCard);
      window.removeEventListener('flash-clearance-help-icon', onFlashHelpIcon);
    };
  }, []);

  if (isMobile && mode === 'view') {
    return (
      <ClearanceCardMobile
        mode={mode}
        disableActions={disableActions}
        clearance={clearance}
        setSelectedForm={setSelectedForm}
        setEditDetailsOpen={setEditDetailsOpen}
        setOpenDeleteModal={setOpenDeleteModal}
      />
    );
  }

  return (
    <>
      <Card 
        elevation={8}
        sx={{
          position: 'relative',
          overflow: 'visible',
          minWidth: '300px', 
          maxWidth: '450px',
          flex: {
            xs: '1 1 100%', // Full width on small screens
            sm: '0 1 auto'  // Natural width on larger screens
          },
          ...(flashCardRipple
            ? createRippleStyles({
                animationName: 'clearanceCardRipple',
                inset: '-2px',
                borderRadius: 'inherit',
                scaleFrom: 1,
                scaleTo: 1.06,
                opacityFrom: 0.55,
                zIndex: 1,
              })
            : {}),
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
            </Box>
          }
          subheader={getCardSubHeaderText(clearance.FormStatus.id)}
          avatar={getCardAvatar(clearance.FormStatus.id, cardColour)}
          action={
            !disableActions && (
              <Tooltip 
                title={'Clearance Help'} 
                placement="top" 
                slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
              >
                <IconButton 
                  aria-label="clearance-help"
                  onClick={() => setShowInfo((prev) => !prev)}
                  sx={{
                    position: 'relative',
                    ...(flashHelpIcon
                      ? createRippleStyles({
                          animationName: 'clearanceHelpRipple',
                          inset: '-2px',
                          borderRadius: '50%',
                          scaleFrom: 0.7,
                          scaleTo: 1.5,
                          opacityFrom: 0.75,
                        })
                      : {}),
                  }}
                >
                  <HelpOutlined sx={{color: showInfo ? 'primary.dark' : 'primary.main'}} />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <Divider sx={{color: 'darkGrey'}}/>
        <Collapse in={showInfo}>
          <ClearanceUsage clearance={clearance} />
        </Collapse>
        <CardContent sx={{display: 'flex', flexDirection:'column', paddingBottom: 0}} >
          <Grid container columns={5} spacing={1} sx={{mb:1}}>
            <Grid size={2} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
              <Typography 
                variant="body1"
                sx={{mr:0.5}}
              >
                Status:
              </Typography>
            </Grid>
            <Grid size={3} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
              <Chip 
                label={
                  <Box sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography variant='body1'>
                      {clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_APPLIEDNOC ? "Applied" : clearance.FormStatus.Name}
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
                <Grid size={2}>
                  <Typography variant="body1">
                    Expires:
                  </Typography>
                </Grid>
                <Grid size={3} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
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
            
            <Grid size={2}>
              <Typography variant='body1'>Locations: </Typography>
            </Grid>
            <Grid size={3}>
              {
                clearance.Locations && clearance.Locations.length > 0
                ? clearance.Locations.map((location) => {
                  const locationDetails = locations?.find((loc) => loc._id === location);
                  if(!!locationDetails) {
                    return (
                      <Typography key={clearance._id+'+'+location} variant='body1'>
                        {locationDetails ? (locationDetails.Name+" ("+locationDetails.Suburb+")") : 'Unknown Location'}
                      </Typography>
                    );
                  }
                })
                : <Typography variant='body1'>All</Typography>
              }
            </Grid>
            {
              [
                process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER,
                process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR,
                process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATEVOLUNTEER,
                process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATECONTRACTOR
              ].includes(clearance.FormType.id) && <>
                <Grid size={2}>
                  <Typography variant='body1'>WWCC Number: </Typography>
                </Grid>
                <Grid size={3}>
                  { mode === 'edit' && (
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
                  )}
                  { mode === 'view' && (
                    <Typography variant='body1'>
                      {clearance.WwccNumber ? clearance.WwccNumber : '(none)'}
                    </Typography>
                  )}
                </Grid>
                <Grid size={2}>
                  <Typography variant='body1'>WWCC Expiry{mode==='edit'?'*: ' : ': '}</Typography>
                </Grid>
                <Grid size={3}>
                  { mode === 'edit' && (
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
                              ['', undefined, null].includes(clearance?.WwccExpiryDate)
                              || !dayjs(clearance?.WwccExpiryDate).isValid()
                            ),
                            helperText: (
                              ['', undefined, null].includes(clearance?.WwccExpiryDate)
                              ? "Required"
                              :  !dayjs(clearance?.WwccExpiryDate).isValid()
                                ? "Invalid Date"
                                : ""
                            ),
                          }
                        }}
                      />
                    </LocalizationProvider>
                  )}
                  { mode === 'view' && (
                    <Typography variant='body1' sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                      {clearance.WwccExpiryDate ? dayjs(clearance.WwccExpiryDate).format('DD/MM/YYYY') : '(none)'}
                      { 
                        clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING 
                        ? <Warning sx={{fontSize: '20px', color: cardColour, ml: 0.5}}/>
                        : null
                      }
                    </Typography>
                  )}
                </Grid>
              </>
            }
            <Grid size={2}>
              <Typography variant='body1'>Phone Number: </Typography>
            </Grid>
            <Grid size={3}>
              { mode === 'edit' && (
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
              )}
              {
                mode === 'view' && (
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
              { mode === 'edit' && (
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
              )}
              { mode === 'view' && (
                <Typography variant='body1'>
                  {clearance.EmailAddress ? clearance.EmailAddress : '(none)'}
                </Typography>
              )}
            </Grid>
            <Grid size={2}>
              <Typography variant='body1'>Organisation: </Typography>
            </Grid>
            <Grid size={3}>
              { mode === 'edit' && (
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

              )}
              { mode === 'view' && (
                <Typography variant='body1'>
                  {clearance.OrganisationName ? clearance.OrganisationName : '(none)'}
                </Typography>
              )}
            </Grid>
            <Grid size={2}>
              <Typography variant='body1'>Organisation ABN: </Typography>
            </Grid>
            <Grid size={3}>
              { mode === 'edit' && (
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
              )}
              { mode === 'view' && (
                <Typography variant='body1'>
                  {clearance.OrganisationAbn ? clearance.OrganisationAbn : '(none)'}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        {
          !disableActions && (
            <>
              <Divider sx={{mt:1, mb:1}}/>
              <CardActions>
                <ActionButtons
                  clearance={clearance}
                  setSelectedForm={setSelectedForm}
                  setEditDetailsOpen={setEditDetailsOpen}
                  setOpenDeleteModal={setOpenDeleteModal}
                />
              </CardActions>
            </>
          )
        }
      </Card>
    </>
  );
}

