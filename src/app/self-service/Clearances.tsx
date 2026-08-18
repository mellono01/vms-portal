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
import { ClearanceCard } from './components/ClearanceCard/ClearanceCard';
import { PlaceholderClearance } from './components/ClearanceCard/PlaceholderClearance';
import { EditModal } from './components/EditModal/EditModal';
import DeleteModal from './DeleteModal';

// DTO
import type { Form } from '@/lib/dto/Form.dto';
import dayjs from 'dayjs';

const ShowClearances = () => {
	// Store Hooks
	const { 
		userData,
		setSelectedForm 
	} = useStore((store) => store);

	// State
  const [editDetailsOpen, setEditDetailsOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

	const currentForms = userData?.Forms.map((form) => form.FormType.id) || [];
	const isUnder18 = userData?.DateOfBirth
		? dayjs().diff(dayjs(userData.DateOfBirth), 'year') < 18
		: false;

	if(userData && userData.Forms !== null) {
		return (
			<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
				<Typography variant='h5' sx={{ textAlign: 'center', mb: 5 }}>
					Your clearances & contact details:
				</Typography>

				<Box sx={{
					display: 'flex',
					flexDirection: {
						xs: 'column', // Stack vertically on small screens
						sm: 'row'     // Arrange horizontally on larger screens
					},
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'flex-start',
					alignContent: 'center',
					gap: 2,
					width: '95%', 
					mb:8
				}}>
					{
						(userData.Forms).map((form: Form) => {
							return (
								<ClearanceCard
        					key={`selfservice-clearance-${form._id}`} 
									mode='view'
									clearance={form}
									setSelectedForm={setSelectedForm}
									setEditDetailsOpen={setEditDetailsOpen}
									setOpenDeleteModal={setOpenDeleteModal}
									disableActions={false}
								/>
							)
						})
					}
					{
						!currentForms.some((type) => [
							process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT, 
							process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER
						].includes(type)) && (
							<PlaceholderClearance
								type='volunteer'
								under18={isUnder18}
							/>
						)
					}
					{
						!currentForms.some((type) => [
							process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT, 
							process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR
						].includes(type)) && (
							<PlaceholderClearance
								type='contractor'
								under18={isUnder18}
							/>
						)
					}
				</Box>
				<EditModal 
					open={editDetailsOpen} 
					onClose={() => setEditDetailsOpen(false)}
				/>
				<DeleteModal
					open={openDeleteModal}
					setOpen={setOpenDeleteModal}
				/>
			</Box>
		)
	}
}

export default ShowClearances