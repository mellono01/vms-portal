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
import ClearanceCard from './components/ClearanceCard';
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

	// State
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
							return (
								<ClearanceCard
        					key={`selfservice-clearance-${form._id}`} 
									mode='view'
									clearance={form}
									expanded={openDetails[form._id]?.expanded || false}
									setExpanded={() => handleCollapse(form._id)}
									setSelectedForm={setSelectedForm}
									handleOpenActionsMenu={handleOpenActionsMenu}
									handleCloseActionsMenu={handleCloseActionsMenu}
								/>
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