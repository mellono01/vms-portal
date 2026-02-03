import React from 'react';

import { useSession } from 'next-auth/react'

import { 
  Box, 
  Grid2 as Grid,
  Typography 
} from '@mui/material'

import {
	useStore,
} from '@/lib/providers/storeProvider'

// Components
import ClearanceMenu from './ClearanceMenu';
import { ClearanceCard } from './components/ClearanceCard';
import { EditModal } from './components/EditModal/EditModal';
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