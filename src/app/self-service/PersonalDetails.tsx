
import { useState } from 'react';
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs';

import {
	Box,
  Card, 
  CardContent, 
  Divider, 
  Grid2 as Grid, 
  IconButton, 
  Typography 
} from '@mui/material'

import {
	Visibility,
	VisibilityOff
} from '@mui/icons-material';

// Components
import ContactUs from '@/app/components/ContactUs';

const PersonalDetails = () => {
  const { data: session, status } = useSession();
	const [showToken, setShowToken] = useState(false);

	if (session?.user) {
		return (
			<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '95%'}}>
				<Typography variant='h5' sx={{ mb: 5 }}>Hi {session.user?.FirstName}, here are your details:</Typography>
				<Card sx={{mb: 5, maxWidth: '450px'}}>
					<CardContent sx={{display: 'flex', flexDirection:'column'}} >
						<Grid container columns={5} spacing={1}>
							<Grid size={2} sx={{display: 'flex', alignItems: 'center'}}>
								<Typography variant='body1'>CEDoW Token:</Typography>
							</Grid>
							<Grid size={3} sx={{display: 'flex', alignItems: 'center'}}>
								{showToken ? (
									<Typography variant='body1' sx={{mr: 0.5}}>{session.user.CedowToken}</Typography>
								) : (
									<Typography variant='body1' sx={{mr: 0.5, fontStyle: 'italic', color: 'text.secondary'}}>Hidden</Typography>
								)}
								<IconButton onClick={() => setShowToken((prev) => !prev)}>
									{showToken ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</Grid>
							<Grid size={2}>
								<Typography variant='body1'>First Name:</Typography>
							</Grid>
							<Grid size={3}>
								<Typography variant='body1'>{session.user.FirstName}</Typography>
							</Grid>
							<Grid size={2}>
								<Typography variant='body1'>Middle Name:</Typography>
							</Grid>
							<Grid size={3}>
								<Typography variant='body1'>{!!session.user?.MiddleName ? session.user?.MiddleName : '(not provided)'}</Typography>
							</Grid>
							<Grid size={2}>
								<Typography variant='body1'>Last Name:</Typography>
							</Grid>
							<Grid size={3}>
								<Typography variant='body1'>{session.user?.LastName}</Typography>
							</Grid>
							<Grid size={2}>
								<Typography variant='body1'>Date of Birth:</Typography>
							</Grid>
							<Grid size={3}>
								<Typography variant='body1'>{dayjs(session.user?.DateOfBirth).format('DD/MM/YYYY')}</Typography>
							</Grid>
						</Grid>
						<Divider sx={{mt:2, mb:2}} />
						<ContactUs text="To update these details, please contact us at:" />
					</CardContent>
				</Card>
			</Box>
		)
	}
}

export default PersonalDetails