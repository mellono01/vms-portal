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
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const BodyText = styled(Typography)(({ theme }) => ({
  width: '90%',
  [theme.breakpoints.up('sm')]: {
    width: '70%',
  },
  textAlign: 'center',
}));

interface Props {}

export default function Faq({}: Props) {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', width: '90%'}}>
      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mt:4, mb:2}}>
          CEDoW Token
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What is a CEDoW Token?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              A CEDoW Token is a unique code that is issued upon completion of the induction. 
              It is required to sign in when visiting any of our sites. 
              It starts with 'DOW' followed by a combination of 6 digits and letters (e.g. DOW123ABC).
              <br/><br/>
              Your CEDoW Token should be treated as private information. Only you are allowed to use your CEDoW Token and it <strong>must not be shared</strong> with anyone else.
              <br/><br/>
              Each person should only have <strong>one</strong> CEDoW Token. If you have lost or forgotten your CEDoW Token please use recover it <NextLink href="/recover">here</NextLink>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">How do I get a CEDoW Token?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              A CEDoW Token is issued upon successful completion of our online induction. If you have <strong>not</strong> completed our induction before please <NextLink href="/sign-up">sign up</NextLink>.
              <br/><br/>
              If you have completed the induction before and have lost or forgotten your CEDoW Token please recover it <NextLink href="/recover">here</NextLink>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography component="span">How do I find my CEDoW Token?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you have completed our induction before your CEDoW Token was sent to the email address provided. Please check your inbox for this email address and any junk or spam folders.
              <br/><br/>
              If you cannot find this email please contact us or attempt to recover it <NextLink href="/recover">here</NextLink>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <Typography component="span">What should I do if I cannot find my CEDoW Token email?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you cannot find this email please contact us or attempt to recover it <NextLink href="/recover">here</NextLink>. Please <strong>do not</strong> complete the sign-up process again.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mt:4, mb:2}}>
          Induction
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What is the induction and what is involved?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Our induction is a short online module that all visitors must complete prior to being issued a CEDoW Token. This induction will:
              <ol>
                <li>Ask some questions about the nature of your visit</li>
                <li>Determine what clearance is appropriate for your visit and what information we need to collect from you</li>
                <li>Provide important information relevant to your visit</li>
                <li>Ask for your agreement to keep our schools a safe environment for everyone</li>
              </ol>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography component="span">Why do I need to complete the induction?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              By completing the induction you are helping us to ensure the safety and well-being of all staff, students and visitors in our schools.
              <br/><br/>
              The induction helps us determine what you will be doing on site so we can assign you the appropriate clearance for your visit. It helps us collect the correct information from you so we remain compliant with relevant regulation and legislation.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">What information will I need to provide?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The information we ask for depends on the nature of your visit and the clearance required. At a minimum you will be asked to provide basic contact information.
              <br/><br/>
              Child protection laws require us to ask for a valid Working With Children Check (WWCC) if you will be involved in <NextLink href={process.env.NEXT_PUBLIC_CHILD_RELATED_WORK_URL??''} target='_blank, noreferrer'>child-related work</NextLink>. 
              If you are asked to provide a Working with Children Check (WWCC) our team will need to verify it before your CEDoW Token is issued.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <Typography component="span">Why do I need to provide this information?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We only ask for the minimum information required to determine the appropriate clearance for your visit and to remain compliant with relevant regulation and legislation.
              <br/><br/>
              All information provided is handled in accordance with our privacy policy.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
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