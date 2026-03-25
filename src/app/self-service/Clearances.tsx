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
import { ClearanceCard } from './components/ClearanceCard';
import { EditModal } from './components/EditModal/EditModal';
import DeleteModal from './DeleteModal';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

const ShowClearances = () => {
	// Store Hooks
	const { 
		userData,
		setSelectedForm 
	} = useStore((store) => store);

	// State
  const [editDetailsOpen, setEditDetailsOpen] = React.useState(false);
  const [openCloseModal, setOpenCloseModal] = React.useState(false);

	if(userData && userData.Forms !== null) {
		return (
			<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
				<Typography variant='h5' sx={{ textAlign: 'center', mb: 5 }}>
					Here are your clearances & contact details:
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
					gap: 2,
					width: '95%'
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