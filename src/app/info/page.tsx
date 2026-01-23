'use client';

import NextLink from 'next/link'

import {
  Box,
  Stepper,
  Step,
  StepLabel as MuiStepLabel,
  Typography,
  StepContent,
  Paper,
  styled,
} from '@mui/material';

const BodyText = styled(Typography)(({ theme }) => ({
  width: '90%',
  [theme.breakpoints.up('sm')]: {
    width: '70%',
  },
  textAlign: 'center',
}));

interface Props {}

export default function InfoPage({}: Props) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
      <Typography variant="h4" sx={{mt:4, mb:4}}>
        VMS Visitor Portal
      </Typography>
      <Typography variant="h6" sx={{mb:2, width: '95%', textAlign: 'center'}}>
        We are committed to ensuring the safety and well-being of all staff, students and visitors in our schools.
      </Typography>
      <BodyText sx={{mb:3}}>
       As part of this commitment all visitors must complete a short online induction <strong>once</strong> and sign in using their issued CEDoW Token when arriving on site.
      </BodyText>
      <InductionStepper />
      <BodyText sx={{mt:3, mb:3}}>
        You can <NextLink href="/sign-in">sign in</NextLink> to this portal using your CEDoW Token to view your details and manage your clearances.
      </BodyText>
      <BodyText sx={{mb:3}}>
        For more information on how we handle your personal information please see our privacy policy.
      </BodyText>
      <BodyText sx={{mb:3}}>
        If you have any questions please read the <NextLink href="/faqs">Frequently Asked Questions (FAQs)</NextLink> or contact us <br />
        P | {process.env.NEXT_PUBLIC_WWC_PHONE} (Monday to Friday, 9am to 5pm) <br />
        E | {process.env.NEXT_PUBLIC_WWC_EMAIL}
      </BodyText>
      <BodyText sx={{mb:5}}>
        Thank you for helping keep our schools a safe environment for everyone.
      </BodyText>
    </Box>
  );
}

const StepLabel = styled(MuiStepLabel)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: theme.palette.primary.main,
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.primary.main,
    }
  },
  '& .MuiStepLabel-label': {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.palette.text.primary,
    '&.Mui-active': {
      fontWeight: 600,
    }
  }
}));

function InductionStepper() {
  return (
    <Box 
      component={Paper} 
      sx={{ 
        border: '1px solid', 
        borderRadius: '10px', 
        borderColor: 'primary.main', 
        width: {
          xs: '90%', 
          sm: '70%'
        }, 
        m:3
      }}
    >
      <Stepper 
        activeStep={0} 
        orientation="vertical"
        sx={{m:3}}
      >
        <Step key={1} expanded={true}>
          <StepLabel>
            Complete Online Induction
          </StepLabel>
          <StepContent>
            <Typography sx={{mb:2}}>
              As part of this induction we will ask some questions about you and the nature of your visit to determine which clearance you will receive.
              <br /><br />
              If you require a CEDoW Token and have <strong>not</strong> completed our induction before, please <NextLink href="/sign-up">sign up here</NextLink>.
            </Typography>
          </StepContent>
        </Step>
        <Step key={2} expanded={true}>
          <StepLabel>
            Receive CEDoW Token
          </StepLabel>
          <StepContent>
            <Typography>
              Your induction will be reviewed by our team and once approved you will be sent your CEDoW Token via email.
              Your CEDoW Token is reusable and must not be shared with anyone else.
            </Typography>
          </StepContent>
        </Step>
        <Step key={3} expanded={true}>
          <StepLabel>
            Sign In on Site
          </StepLabel>
          <StepContent>
            <Typography>
              Whenever you visit one of our sites you will need to sign in using your CEDoW Token.
              We highly recommend installing our Quick Sign In app on your mobile device to make this process quick and easy.
            </Typography>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
}