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
  Typography 
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
  Add,
  Circle,
  Upload as Upgrade,
  HelpOutlined,
  QrCode2,
} from "@mui/icons-material";
import { alpha } from '@mui/material/styles';

// Store
import { useStore } from '@/lib/providers/storeProvider';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

// Hooks
import { useStatusColour } from '@/app/lib/hooks/useStatusColour';
import generateQrCode from "@/utils/qrCode/generateQrCode";

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
  clearance,
  setSelectedForm,
  setEditDetailsOpen,
}: {
  mode: 'view' | 'edit';
  clearance: Form;
  setSelectedForm: (form: Form) => void;
  setEditDetailsOpen: (open: boolean) => void;
}) {
  const router = useRouter();

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
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCode, setQrCode] = useState<string | undefined>(undefined);

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

  function getClearanceTypeInfo(formTypeId: string): { uses: string[]; upgradeNote?: string; upgradeItems?: string[] } {
    switch (formTypeId) {
      case process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT:
        return {
          uses: [
            'Visits as a parent or close relative of a child attending the school you are visiting', 
            'Visits speaking to children where you do not normally work with children (up to 5 days per year)'
          ],
          upgradeNote: 'Upgrade to a "Volunteer" clearance if you will be:',
          upgradeItems: [
            'Volunteering to attend a camp and stay overnight',
            'Providing personal care to a child with a disability',
            'Volunteering as part of a formal mentoring program (i.e Duke of Edinburgh)',
            'Any other unpaid work that involves contact with children or sensitive information about children'
          ],
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT:
        return {
          uses: ['Work as a tradesperson (e.g. plumber, electrician, builder)', 'Building related works (e.g. architect, engineer, planning)', 'Maintenance/Property projects (e.g. lawns, landscaping, tree trimming and removal)'],
          upgradeNote: 'Upgrade to a "Contractor" clearance if you will be:',
          upgradeItems: [
            'Providing cleaning services at a school',
            'Visiting as a children\'s entertainer (e.g. footy coach, clown, musician)',
            'Working as a transport services provider',
            'Any other paid work that involves contact with children or sensitive information about children'
          ]
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER:
        return {
          uses: ['All volunteer (unpaid) visits, including those that require a Working With Children Check (WWCC)'],
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR:
        return {
          uses: ['All contractor (paid) visits, including those that require a Working With Children Check (WWCC)'],
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATEVOLUNTEER:
        return {
          uses: ['Volunteer visits by interstate visitors', 'WWCC is verified from your home state'],
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATECONTRACTOR:
        return {
          uses: ['Contractor visits by interstate contractors', 'WWCC is verified from your home state'],
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_STAFF:
        return {
          uses: ['Staff access to sites'],
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_ADHOC:
        return {
          uses: ['Ad-hoc visits to sites'],
        };
      case process.env.NEXT_PUBLIC_FORM_TYPES_ORGANISATIONAPPROVEDPERSON:
        return {
          uses: ['Visits as an organisation-approved person'],
        };
      default:
        return { uses: [] };
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

  async function handleShowQrCode() {
    if(showQrCode) { // If QR code is already showing, hide it instead of generating a new one
      setShowQrCode(false);
      return;
    }

    const qr = await generateQrCode({
      FirstName: "TEST",
      LastName: "TEST",
      PhoneNumber: "TEST",
      EmployeeNumber: "TEST",
      CedowToken: "TEST",
      Organisation: "TEST",
      ReasonForVisit: "DUNNO AYE",
    });

    if(!!qr) {
      console.log('Generated QR code successfully');
      setQrCode(qr);
      setShowQrCode((prev) => !prev)
    } else {
      console.error('Failed to generate QR code');
    }

  }

  return (
    <>
      <Card 
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
              {/* {
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
              } */}
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
          action={
            <>
              <Tooltip
                title={'Show QR Code'}
                placement="top" 
                slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
              >
                <IconButton
                  onClick={async () => handleShowQrCode()}
                >
                  <QrCode2 sx={{color: 'primary.main'}} />
                </IconButton>
              </Tooltip>
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
            </>
          }
        />
        <Divider sx={{color: 'darkGrey'}}/>
        <Collapse in={showInfo}>
          {(() => {
            const typeInfo = getClearanceTypeInfo(clearance.FormType.id);
            const under18 = clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18;
            return (
              <Box sx={{ px: 2, py: 1.5, backgroundColor: 'primary.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                {
                  under18 && (
                    clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT || 
                    clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER
                  ) && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.success.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        This clearance can be used for:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: '20px', mb: typeInfo.upgradeNote ? 1 : 0 }}>
                        <li>
                          <Typography variant="body2">
                            All unpaid work while you are under 18 years of age
                          </Typography>
                        </li>
                      </Box>
                    </Box>
                  )
                }
                {
                  under18 && 
                  clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER &&
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
                    <Typography variant="body2">
                      Once you turn 18 you will need to provide a Working With Children Check (WWCC) to continue using this clearance.
                    </Typography>
                  </Box>
                }
                {
                  under18 && (
                    clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT ||
                    clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR
                  ) && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.success.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        This clearance can be used for:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: '20px', mb: typeInfo.upgradeNote ? 1 : 0 }}>
                        <li>
                          <Typography variant="body2">
                            All paid work while you are under 18 years of age
                          </Typography>
                        </li>
                      </Box>
                    </Box>
                  )
                }
                {
                  under18 && 
                  clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR &&
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
                    <Typography variant="body2">
                      Once you turn 18 you will need to provide a Working With Children Check (WWCC) to continue using this clearance.
                    </Typography>
                  </Box>
                }
                { !under18 && typeInfo.uses.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.success.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600}}>
                      This clearance can be used for:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: '20px', mb: typeInfo.upgradeNote ? 1 : 0 }}>
                      {typeInfo.uses.map((use, i) => (
                        <li key={i}><Typography variant="body2">{use}</Typography></li>
                      ))}
                    </Box>
                  </Box>
                )}
                {typeInfo.upgradeNote && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.warning.light, 0.3), borderRadius: 1, border: '1px solid', borderColor: 'warning.light' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600}}>
                      {typeInfo.upgradeNote}
                    </Typography>
                    {typeInfo.upgradeItems && typeInfo.upgradeItems.length > 0 && (
                      <Box component="ul" sx={{ m: 0, mt: 0.5, pl: '20px' }}>
                        {typeInfo.upgradeItems.map((item, i) => (
                          <li key={i}><Typography variant="body2">{item}</Typography></li>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            );
          })()}
        </Collapse>
        <Collapse in={showQrCode}>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2}}>
            <img src={qrCode} alt='QR Code' width='200' height='200' />
          </Box>
          <Divider sx={{color: 'darkGrey'}}/>
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
        </CardContent>
        <Divider sx={{mt:1, mb:1}}/>
        <CardActions>
          <Box sx={{display:'flex', flexDirection:'row', justifyContent:'start', width:'100%', mb:1}}>
            <Tooltip 
              title={'Delete Clearance'} 
              placement="top" 
              slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
            >
              <Button 
                variant='text' 
                sx={{textTransform: 'none'}}
                onClick={() => {}}
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
              (clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT ||
              clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT) && 
              <Tooltip 
                title={'Upgrade Clearance'} 
                placement="top" 
                slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
              >
                <Button 
                  variant='text' 
                  sx={{textTransform: 'none'}}
                  onClick={() => {
                    router.push('/clearance/upgrade');
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
        </CardActions>
      </Card>
    </>
  );
}

export const PlaceholderClearance = ({
  type,
  under18,
}: {
  type: 'volunteer' | 'contractor';
  under18: boolean;
}) => {
  const router = useRouter();

  const volunteerText = {
    ids: [process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT, process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER],
    text: 'A "Volunteer" clearance is required if you will be attending schools for unpaid work.',
    wwccItems: [
      'Volunteering to attend a camp and stay overnight',
      'Will be providing personal care to a child with a disability',
      'Volunteering as part of a formal mentoring program (i.e Duke of Edinburgh)',
      'Any other unpaid work that involves contact with children or sensitive information about children'
    ],
  }

  const contractorText = {
    ids: [process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT, process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR],
    text: 'A "Contractor" clearance is required if you will be attending schools for paid work.',
    wwccItems: [
      'Providing cleaning services at a school',
      'Visiting as a children\'s entertainer (e.g. magician, carnival, musician)',
      'Working as a transport services provider',
      'Any other paid work that involves contact with children or sensitive information about children'
    ]
  }

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
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
        },
        border: '1px dashed',
      }}
      onClick={() => {
        router.push('/clearance/new');
      }}
    >
      <CardHeader 
        title={
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h6">
              {
                type === 'contractor' && (
                  'Add Contractor Clearance'
                )
              }{
                type === 'volunteer' && (
                  'Add Volunteer Clearance'
                )
              }
            </Typography>
            {/* <Box sx={{width: '200px', height: '30px', backgroundColor: 'lightgrey'}}></Box> */}
          </Box>
        }
        avatar={<Add sx={{ fontSize: '35px', color: 'primary.main' }} />}
        // avatar={<Circle sx={{ fontSize: '35px', color: 'lightgrey' }} />}
      />
      <Divider sx={{color: 'darkGrey'}}/>
      <CardContent sx={{display: 'flex', flexDirection:'column', minHeight: '128px', justifyContent: 'center', alignContent: 'center'}} >
        {
          type === 'volunteer' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {volunteerText.text}
              </Typography>
              {
                !under18 &&
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600}}>
                    A Working With Children Check (WWCC) is also required if you will be doing any of the following:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, mt: 0.5, pl: '20px' }}>
                    {volunteerText.wwccItems.map((item, i) => (
                      <li key={i}><Typography variant="body2">{item}</Typography></li>
                    ))}
                  </Box>
                </Box>
              }
              {
                under18 && 
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
                  <Typography variant="body2">
                    A Working With Children Check (WWCC) will not be required while you are under 18 years of age. Once you turn 18 you may be required to obtain and provide one.
                  </Typography>
                </Box>
              }
            </Box>
          )
        }
        {
          type === 'contractor' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {contractorText.text}
              </Typography>
              {
                !under18 &&
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600}}>
                    A Working With Children Check (WWCC) is also required if you will be doing any of the following:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, mt: 0.5, pl: '20px' }}>
                    {contractorText.wwccItems.map((item, i) => (
                      <li key={i}><Typography variant="body2">{item}</Typography></li>
                    ))}
                  </Box>
                </Box>
              }
              {
                under18 && 
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
                  <Typography variant="body2">
                    A Working With Children Check (WWCC) will not be required while you are under 18 years of age. Once you turn 18 you may be required to obtain and provide one.
                  </Typography>
                </Box>
              }
            </Box>
          )
        }
        {/* <Grid container columns={5} spacing={1} sx={{ mb:1 }}>
          <Grid size={5} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', flexGrow: 1}}>
            <Add sx={{ fontSize: '28px', color: 'grey', mr: 0.5, height: '100%' }}/>
            <Typography 
                variant="body1"
                sx={{mr:0.5}}
            >
                Add New Clearance
            </Typography>
          </Grid>
        </Grid> */}
      </CardContent>
    </Card>
  );
}