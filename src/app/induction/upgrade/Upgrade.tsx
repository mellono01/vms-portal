'use client';

import {
  Box,
} from '@mui/material';

import FeatheryForm from '../FeatheryForm';

// DTO
import { PrefillForm } from '@lib/dto/feathery/PrefilledForm.dto';

interface Props {
  formValues: PrefillForm;
  featheryKey: string;
  formId: string;
}

export default function UpgradeClearance({ 
  formValues, 
  featheryKey,
  formId
}: Props) {
  console.log('Prefilled Values', formValues);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:1}}>
      <FeatheryForm 
        prefilledValues={formValues} 
        featherySdk={featheryKey} 
        formId={formId} 
      />
    </Box>
  );

}