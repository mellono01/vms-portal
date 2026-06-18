'use client'

import { useRouter } from 'next/navigation';

import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Typography 
} from "@mui/material";

import { 
  Add
} from "@mui/icons-material";

import { alpha } from '@mui/material/styles';

// Consts
import { volunteerText, contractorText } from "./consts";

const cardStyles = {
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
}

const wwccRequiredBox = (items: string[]) => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      mt: 1,
      p: 1, 
      backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), 
      borderRadius: 1, 
      border: '1px solid', 
      borderColor: 'info.light' 
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 600}}>
      A Working With Children Check (WWCC) is also required if you will be doing any of the following:
    </Typography>
    <Box component="ul" sx={{ m: 0, mt: 0.5, pl: '20px' }}>
      {volunteerText.wwccItems.map((item, i) => (
        <li key={i}><Typography variant="body2">{item}</Typography></li>
      ))}
    </Box>
  </Box>
)

const wwccNotRequiredBox = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
    <Typography variant="body2">
      A Working With Children Check (WWCC) will not be required while you are under 18 years of age. Once you turn 18 you may be required to obtain and provide one.
    </Typography>
  </Box>
)

export const PlaceholderClearance = ({
  type,
  under18,
}: {
  type: 'volunteer' | 'contractor';
  under18: boolean;
}) => {
  const router = useRouter();

  return (
    <Card 
      key={`selfservice-clearance-placeholder`} 
      variant="outlined"
      sx={cardStyles}
      onClick={() => {
        router.push('/clearance/new');
      }}
    >
      <CardHeader 
        title={
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h6">
              { type === 'contractor' && ( 'Add Contractor Clearance' ) }
              { type === 'volunteer' && ( 'Add Volunteer Clearance' ) }
            </Typography>
          </Box>
        }
        avatar={<Add sx={{ fontSize: '35px', color: 'primary.main' }} />}
      />
      <Divider sx={{color: 'darkGrey'}}/>
      <CardContent sx={{display: 'flex', flexDirection:'column', minHeight: '128px', justifyContent: 'center', alignContent: 'center'}} >
        {
          type === 'volunteer' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {volunteerText.text}
              </Typography>
              { !under18 && wwccRequiredBox(volunteerText.wwccItems) }
              { under18 && wwccNotRequiredBox() }
            </Box>
          )
        }
        {
          type === 'contractor' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {contractorText.text}
              </Typography>
              { !under18 && wwccRequiredBox(contractorText.wwccItems) }
              { under18 && wwccNotRequiredBox() }
            </Box>
          )
        }
      </CardContent>
    </Card>
  );
}