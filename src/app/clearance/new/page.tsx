'use client';

import { useSession } from 'next-auth/react'

import {
  Box,
} from '@mui/material';

import FeatheryForm from '../upgrade/FeatheryForm';

interface Props {}

export default function Portal({}: Props) {
  const { data: session, status } = useSession();

  if(session?.user) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt:5}}>
        <FeatheryForm from="new" />
      </Box>
    );
  }

}