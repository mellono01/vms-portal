import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import Recovery from '@/app/recovery/Recovery';

interface Props {}

export default function RecoveryPage({}: Props) {

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
      <Recovery/>
    </Box>
  );
}