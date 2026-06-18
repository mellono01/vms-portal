import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'


// Components
import InductionComplete from '@/app/induction/complete/Complete'
import { Box, Button, Link } from '@mui/material'


export default async function InductionCompletePage() {
  const session = await getServerSession(authOptions)

  if(session && session.user && session.user.method === 'mfa-sign-in') {
    // Add button to go back to portal page
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <InductionComplete />
        <Button
          variant="contained"
          sx={{ mt: 3 }}
        >
          <Link href="/vms/portal" sx={{ color: 'white', textDecoration: 'none' }}>Back to Portal</Link>
        </Button>
      </Box>
    )
  } else {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <InductionComplete />
      </Box>
    )
  }
}