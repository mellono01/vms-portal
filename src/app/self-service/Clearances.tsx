import React from 'react';
import dayjs from 'dayjs';

import NextLink from 'next/link'

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
  Tooltip, 
  Typography 
} from '@mui/material'

import {
	Add,
	CheckCircle,
	Circle,
	Dangerous,
	Error,
  ErrorOutline,
	HelpOutline,
	MoreVert,
	Upgrade,
	Warning
} from '@mui/icons-material'

import {
	useStore,
} from '@/lib/providers/storeProvider'

// Hooks
import { useStatusColour } from '@/app/lib/hooks/useStatusColour';

// Components
import ClearanceMenu from './ClearanceMenu';
import { EditModal } from './EditModal';
import DeleteModal from './DeleteModal';

// DTO
import type { Form as ImportedForm } from '@/lib/dto/Form.dto';
type Form = Omit<ImportedForm, '_id'> & { _id: string };

const populateCards = (forms: Form[]) => {
	let cards: Record<string, { expanded: boolean }> = {};
	forms.forEach((form) => {
		if (form._id !== undefined) {
			cards[String(form._id)] = {
				expanded: false,
			};
		}
	});
	return cards;
}

interface Props {
  userData: any;
	getUser: () => Promise<any[]>;
	setLoadingUserData: (loading: boolean) => void;
}

export const PlaceholderClearance = () => {
  return (
		<Card 
			key={`selfservice-clearance-placeholder`} 
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
				mb:5
				// border: '1px dashed',
				// borderColor: 'grey.400'
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
				<Grid container columns={5} spacing={1} sx={{ mb:1}}>
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
			<Divider sx={{color: 'darkGrey'}}/>
			<CardActions sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
				<Box sx={{width: '90px', height: '28px', backgroundColor: 'lightgrey', m:0.5}}></Box>
				<Box sx={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
					<Box sx={{width: '60px', height: '28px', backgroundColor: 'lightgrey', m:0.5}}></Box>
					<Box sx={{width: '50px', height: '28px', backgroundColor: 'lightgrey', m:0.5}}></Box>
				</Box>
			</CardActions>
		</Card>
	);
}

const ShowClearances = ({
  userData,
	getUser,
  setLoadingUserData
}: Props) => {
  const hasCalledRef = React.useRef(false);
  console.warn(userData)

	// Store Hooks
	const { 
		selectedForm, 
		setSelectedForm 
	} = useStore((store) => store);

	// Other Hooks
	const getCardColor = useStatusColour();

	// State
  const [focusedForm, setFocusedForm] = React.useState<Form | null>(null);
  const [editDetails, setEditDetails] = React.useState(false);
	const [openDetails, setOpenDetails] = React.useState(populateCards(userData.Forms));
  const [openCloseModal, setOpenCloseModal] = React.useState(false);

	// Actions Menu
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

	const handleOpenActionsMenu = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		setMenuAnchor(event.currentTarget);
		setMenuOpen(true);
	};

	const handleCloseActionsMenu = () => {
		setMenuAnchor(null);
		setMenuOpen(false);
	};

  React.useEffect(() => { // First render of page
    // Prevent double execution
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;
  }, []);


	const handleCollapse = (formId: string) => {
		setOpenDetails({
			...openDetails,
			[formId]: {
				...openDetails[formId],
				expanded: !openDetails[formId].expanded,
			},
		});
	};

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

	// const getLocations = (locations: string[]) => {
	// 	let displayLocations = "";
	// 	locations.forEach((loc) => {
	// 		schools.forEach((school) => {
	// 			if(school._id === loc) {
	// 				if(displayLocations.length > 0) {
	// 					displayLocations += ",\n";
	// 				}
	// 				displayLocations += (school.Name+" ("+school.Suburb+")");
	// 			}
	// 		})
	// 	})

	// 	return displayLocations;
	// }

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
			<Typography variant='h5' sx={{ textAlign: 'center', mb: 5 }}>
				Here are your clearances & contact details:
			</Typography>

			<ClearanceMenu 
				anchor={menuAnchor} 
				isOpen={menuOpen} 
				setOpen={setMenuOpen} 
				showUpgrade={
					selectedForm?.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT ||
					selectedForm?.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT
				}
			/>

			<Box sx={{
				display: 'flex',
				flexDirection: {
					xs: 'column', // Stack vertically on small screens
					sm: 'row'     // Arrange horizontally on larger screens
				},
				flexWrap: 'wrap',
				justifyContent: 'center',
				alignItems: 'flex-start',
				gap: 2,
				width: '95%'
			}}>
				{
					userData?.Forms.map((form: Form) => {
						const cardColour = getCardColor(form.FormStatus.id);
						return (
							<Card key={`selfservice-clearance-${form._id}`} sx={{
								minWidth: '300px', 
								maxWidth: '450px',
								flex: {
									xs: '1 1 100%', // Full width on small screens
									sm: '0 1 auto'  // Natural width on larger screens
								}
							}}>
								<CardHeader 
									title={
										<Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
											<Box sx={{display: 'flex', flexGrow: 1}}>
												<Typography variant="h6">
													{form.FormType.Name.replace(/(?<!^)([A-Z])/g, " $1")}
												</Typography>
											</Box>
											{
												(
													form.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT ||
													form.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT
												) && (
													<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
														<NextLink href="/clearance/upgrade">
															<Tooltip title="Upgrade Clearance" placement="top" slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}>
																<IconButton size='small' onClick={() => setSelectedForm(form)}>
																	<Upgrade sx={{ fontSize: '28px' }}/>
																</IconButton>
															</Tooltip>
															{/* <Typography variant='body2' sx={{color: 'gray'}}>
																Upgrade
															</Typography> */}
														</NextLink>
													</Box>
												)
											}
										</Box>
									}
									subheader={
										(
											form.FormStatus.id === process.env.NEXT_PUBLIC_STATUS_CLOSED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_BARRED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG
										)
										? <Typography variant='body2' sx={{color: cardColour}}>
											(This clearance cannot be used)
											</Typography>
										: (
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED
										) 
										? <Typography variant='body2' sx={{}}>
											(This clearance is pending review)
											</Typography>
										: null
									}
									avatar={
										(
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLEARED || 
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18 ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_INPROGRESS
										) ? <CheckCircle sx={{ fontSize: '35px', color: cardColour }} />
										: (
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_DECLINED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED
										) ? <Error sx={{ fontSize: '35px', color: cardColour }} />
										: (
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_BARRED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED ||
											form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG
										) ? <Dangerous sx={{ fontSize: '35px', color: cardColour }} />
										: <ErrorOutline />
									}
									// sx={{backgroundColor: cardColour}}
								/>
								<Divider sx={{color: 'darkGrey'}}/>
								<CardContent sx={{display: 'flex', flexDirection:'column'}} >
									<Grid container columns={!openDetails[form._id].expanded ? 4 : 5} spacing={1} sx={{mb:1}}>
										<Grid size={!openDetails[form._id].expanded ? 1 : 2} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
											<Typography 
												variant="body1"
												sx={{mr:0.5}}
											>
												Status:
											</Typography>
										</Grid>
										<Grid size={!openDetails[form._id].expanded ? 3 : 3} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
											<Chip 
												label={
													<Box sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
														<Typography variant='body1'>
															{form.FormStatus.Name}
														</Typography>
													</Box>
												} 
												size='medium'
												sx={{backgroundColor: cardColour, color: 'black', height: 24, mr: 0.5}} 
											/>
											<Tooltip 
												title={getStatusTooltipText(form.FormStatus.id)} 
												placement="top" 
												slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
											>
												<HelpOutline color='primary' sx={{fontSize:'20px'}} />
											</Tooltip>
										</Grid>
										{
											!!getExpiryDateFormat(form.ExpiryDate ? new Date(form.ExpiryDate) : null, form.FormStatus.id)
											? <>
												<Grid size={!openDetails[form._id].expanded ? 1 : 2}>
													<Typography variant="body1">
														Expires:
													</Typography>
												</Grid>
												<Grid size={!openDetails[form._id].expanded ? 3 : 3} sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
													<Typography variant="body1" sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
														{getExpiryDateFormat(form.ExpiryDate ? new Date(form.ExpiryDate) : null, form.FormStatus.id) ? getExpiryDateFormat(form.ExpiryDate ? new Date(form.ExpiryDate) : null, form.FormStatus.id) : null}
														{ 
															form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING 
															? <Warning sx={{fontSize: '20px', color: cardColour, ml: 0.5}}/>
															: null
														}
													</Typography>
												</Grid>
											</>
											: null
										}
										
										<Grid size={!openDetails[form._id].expanded ? 1 : 2}>
											<Typography variant='body1'>Locations: </Typography>
										</Grid>
										<Grid size={!openDetails[form._id].expanded ? 3 : 3}>
											<Typography variant='body1' sx={{whiteSpace: 'pre-line'}}>
												{/* {form.Locations ? getLocations(form.Locations) : 'All'} */}
												</Typography>
										</Grid>
									</Grid>
									<Collapse in={openDetails[form._id].expanded}>
										<Grid container columns={5} spacing={1}>
											{
												form.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER ||
												form.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR ||
												form.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATEVOLUNTEER ||
												form.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATECONTRACTOR
												?
												<>
													<Grid size={2}>
														<Typography variant='body1'>WWCC Number: </Typography>
													</Grid>
													<Grid size={3}>
														<Typography variant='body1'>
															{form.WwccNumber ? form.WwccNumber : '(none)'}
															</Typography>
													</Grid>
													<Grid size={2}>
														<Typography variant='body1'>WWCC Expiry: </Typography>
													</Grid>
													<Grid size={3}>
														<Typography variant='body1' sx={{display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
															{form.WwccExpiryDate ? dayjs(form.WwccExpiryDate).format('DD/MM/YYYY') : '(none)'}
															{ 
																form.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING 
																? <Warning sx={{fontSize: '20px', color: cardColour, ml: 0.5}}/>
																: null
															}
															</Typography>
													</Grid>
												</>
												: null
											}
											<Grid size={2}>
												<Typography variant='body1'>Phone Number: </Typography>
											</Grid>
											<Grid size={3}>
												<Typography variant='body1'>
													{form.PhoneNumber ? form.PhoneNumber : '(none)'}
													</Typography>
											</Grid>
											<Grid size={2}>
												<Typography variant='body1'>Email: </Typography>
											</Grid>
											<Grid size={3}>
												<Typography variant='body1'>
													{form.EmailAddress ? form.EmailAddress : '(none)'}
													</Typography>
											</Grid>
											<Grid size={2}>
												<Typography variant='body1'>Organisation: </Typography>
											</Grid>
											<Grid size={3}>
												<Typography variant='body1'>
													{form.OrganisationName ? form.OrganisationName : '(none)'}
													</Typography>
											</Grid>
											<Grid size={2}>
												<Typography variant='body1'>Organisation ABN: </Typography>
											</Grid>
											<Grid size={3}>
												<Typography variant='body1'>
													{form.OrganisationAbn ? form.OrganisationAbn : '(none)'}
													</Typography>
											</Grid>
										</Grid>
									</Collapse>
								</CardContent>
								<Divider sx={{color: 'darkGrey'}}/>
								<CardActions sx={{display:'flex', flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
										<Button
											onClick={() => handleCollapse(form._id)}
										>
											{
												openDetails[form._id].expanded ? 'Show Less' : 'Show More'
											}
										</Button>
										<Box>
											{ form.FormStatus.id !== process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED
                        ? <Button 
													onClick={()=> {
														setFocusedForm(form);
														setOpenCloseModal(!openCloseModal)
													}}
												>
												  Delete
                        </Button>
                        : null
                      }
											<Button 
												onClick={() => {
                          setFocusedForm(form);
                          setEditDetails(true);
                        }}
											>
												Edit
											</Button>
										</Box>
								</CardActions>
							</Card>
						)
					})
				}
			</Box>
      
				<EditModal 
					open={editDetails} 
					onClose={() => setEditDetails(false)} 
					rowData={focusedForm} 
					setLoadingUserData={setLoadingUserData} 
					getUser={getUser}
				/>
				<DeleteModal
					open={openCloseModal}
					setOpen={setOpenCloseModal}
					data={focusedForm}
					getUser={getUser}
					setLoadingUserData={setLoadingUserData}
				/>
    </Box>
  )
}

export default ShowClearances