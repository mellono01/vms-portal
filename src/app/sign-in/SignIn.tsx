'use client';

import NextLink from 'next/link'

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import {
  useStore,
} from '@/lib/providers/storeProvider'
import { EntityForm } from '@/lib/dto/EntityForm.dto';

const test_data: EntityForm = {
  CedowToken: 'CEDOW12345',
  FirstName: 'Anakin',
  LastName: 'Skywalker',
  DateOfBirth: '1990-01-01',
  Forms: [
    {
      _id: '001',
      FormType: {
        id: '64757b03421f1c21d0ff602c',
        Name: 'Volunteer',
      },
      FormStatus: {
        id: '64757b0d421f1c21d0ff6035',
        Name: 'Cleared',
      },
      Locations: [],
      EmailAddress: 'anakin@skywalker.com',
      PhoneNumber: '0400111222',
      SubmittedDate: '01-12-2025',
      ExpiryDate: '01-12-2026',
      OrganisationName: 'Jedi Order',
      OrganisationAbn: '066',
      DescriptionOfServices: 'Teaching younglings',
      WwccNumber: 'WWC6666666E',
      WwccExpiryDate: '2026-12-31',
      WwccVerificationDate: '2025-12-03',
      CedowToken: '',
      AuditUserId: null,
      Deleted: false,
      SchemaVersion: 0
    },
    {
      _id: '002',
      FormType: {
        id: '64757b03421f1c21d0ff602f',
        Name: 'ContractorExempt',
      },
      FormStatus: {
        id: '64757b0d421f1c21d0ff6035',
        Name: 'Cleared',
      },
      Locations: [],
      EmailAddress: 'anakin@skywalker.com',
      PhoneNumber: '0400111222',
      SubmittedDate: '01-12-2025',
      ExpiryDate: '01-12-2026',
      OrganisationName: 'Jedi Order',
      OrganisationAbn: '066',
      DescriptionOfServices: 'Teaching younglings',
      WwccNumber: 'WWC6666666V',
      WwccExpiryDate: '2026-12-31',
      WwccVerificationDate: '2025-12-03',
      CedowToken: '',
      AuditUserId: null,
      Deleted: false,
      SchemaVersion: 0
    }
  ],
  _id: '',
  Claims: [],
  MiddleName: '',
  Deleted: false,
  SchemaVersion: 0,
  AuditUserId: null
};

interface Props {}

export default function SignIn({}: Props) {

  const {
    userData,
    setUserData,
  } = useStore((store) => store);

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%'}}>
        <Typography variant='body1' sx={{mb:2}}>
          To view and manage your clearances please enter your details below.
        </Typography>
        <Typography variant='body1' sx={{mb:4}}>
          If you don't have a CEDoW Token and need one please <NextLink href='/sign-up'>sign up</NextLink>.
        </Typography>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
          <TextField 
            id='textfield-token' 
            label='Cedow Token' 
            variant='outlined' 
            size='small'
            sx={{width: '400px'}}
          />
          <TextField 
            id='textfield-lastName' 
            label='Last Name' 
            variant='outlined' 
            size='small'
            sx={{width: '400px'}}
          />
        </Box>
        <Button 
          component={NextLink}
          href='/'
          variant='contained' 
          sx={{mt: 2}}
          onClick={()=>{setUserData(test_data);}}
        >
          Go
        </Button>
        <Box sx={{mt:5}}>
          <NextLink 
            href='/recovery'
            style={{textDecoration: 'none'}}
>
            Forgot your Cedow Token?
          </NextLink>
        </Box>
        <Box sx={{mt:2}}>
          <NextLink 
            href='/info' 
            style={{ textDecoration: 'none' }}
          > 
            Need help or more information?
          </NextLink>
        </Box>
      </Box>
    </>
  );
}