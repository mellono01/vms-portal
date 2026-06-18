'use client';

import {
  Box,
} from '@mui/material';

import FeatheryForm from '../FeatheryForm';

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

interface Props {
  formValues: PrefillForm;
}

export default function NewClearance({formValues}: Props) {
  console.log('[Portal] Prefilled Values:', formValues);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
      <FeatheryForm prefilledValues={formValues}/>
    </Box>
  );
}