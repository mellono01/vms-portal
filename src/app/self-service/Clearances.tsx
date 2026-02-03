import React from 'react';
import dayjs from 'dayjs';

import NextLink from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

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
	ExpandLess,
	ExpandMore,
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

const ShowClearances = () => {
  const { data: session, status } = useSession();

	// Store Hooks
	const { 
		selectedForm, 
		setSelectedForm 
	} = useStore((store) => store);

	// Other Hooks
	const getCardColor = useStatusColour();

	// State
  const [focusedForm, setFocusedForm] = React.useState<Form | null>(null);
  const [editDetailsOpen, setEditDetailsOpen] = React.useState(false);
	const [openDetails, setOpenDetails] = React.useState(populateCards(session?.user?.Forms || []));
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

	if(session?.user) {
		return (
			<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
				<Typography variant='h5' sx={{ textAlign: 'center', mb: 5 }}>
					Here are your clearances & contact details:
				</Typography>

				<ClearanceMenu 
					anchor={menuAnchor} 
					isOpen={menuOpen} 
					setOpen={setMenuOpen} 
					setEditDetailsOpen={setEditDetailsOpen}
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
						(session.user?.Forms).map((form: Form) => {
							const cardColour = getCardColor(form.FormStatus.id);
							return (
								<Card 
									key={`selfservice-clearance-${form._id}`} 
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
														{form.FormType.Name.replace(/(?<!^)([A-Z])/g, " $1")}
													</Typography>
												</Box>
												{
													<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
														<IconButton onClick={(event) => {setSelectedForm(form); handleOpenActionsMenu(event);}}>
															<MoreVert />
														</IconButton>
													</Box>
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
									<CardContent sx={{display: 'flex', flexDirection:'column', paddingBottom: 0}} >
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
										<Box sx={{display:'flex', flexDirection:'row', justifyContent:'center', width:'100%'}}>
											<IconButton
												onClick={() => handleCollapse(form._id)}
											>
												{openDetails[form._id].expanded ? <ExpandLess/> : <ExpandMore/>}
											</IconButton>
										</Box>
									</CardContent>
									<Divider sx={{color: 'darkGrey'}}/>
								</Card>
							)
						})
					}
				</Box>
				<EditModal 
					open={editDetailsOpen} 
					onClose={() => setEditDetailsOpen(false)}
				/>
				<DeleteModal
					open={openCloseModal}
					setOpen={setOpenCloseModal}
				/>
			</Box>
		)
	}
}

export default ShowClearances