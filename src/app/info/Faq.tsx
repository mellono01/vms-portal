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
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import { 
  ExpandMore,
  Upgrade
} from '@mui/icons-material';

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
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%'}}>
      <Typography variant="h5" sx={{mt:2, mb:4}}>
        Frequently Asked Questions (FAQ)
      </Typography>

      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mb:2}}>
          General
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What is the VMS?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The VMS (Visitor Management System) is an online system created by the Catholic Education Diocese of Wollongong (CEDoW) for managing visitors in our schools and office sites. This system helps us ensure the safety and well-being of all staff, students and visitors in our schools by making sure we know who is on site at all times and ensuring we are compliant with relevant regulations and legislation.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mb:2}}>
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
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel5-content"
            id="panel5-header"
          >
            <Typography component="span">What should I do if I have more that one CEDoW Token?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you have ended up with multiple CEDoW Tokens please contact us so we can assist you in consolidating them into a single CEDoW Token.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mb:2}}>
          Clearance
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What is a clearance?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              A clearance is the level of access you have to our sites and what activities you are permitted to undertake while on site.
              Successful completion of the induction will assign the appropriate clearance for your visit to your CEDoW Token.
              <br/><br/>
              If you visit our sites for different purposes you may require multiple clearances. Additional clearances can be added to your CEDoW Token in the <NextLink href="/">self-service</NextLink>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What clearance do I need?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The clearance required to enter any of our sites depends on the reason for your visit and the activities you will be undertaking while on site. By completing the induction you will be assigned the appropriate clearance for your visit.
              <br/><br/>
              If you will be visiting our sites for multiple purposes you may require multiple clearances. Additional clearances can be added to your CEDoW Token in the <NextLink href="/">self-service</NextLink>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What clearances are there?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              There are 3 clearance types:
              </Typography>
              <ul>
                <li><strong>Volunteer Clearance</strong> - for visitors undertaking unpaid or volunteer work.</li>
                <li><strong>Contractor Clearance</strong> - for visitors undertaking paid work.</li>
                <li><strong>Staff Clearance</strong> - for staff members of the organisation.</li>
              </ul>
              <Typography>
                These clearances may be appended with "Exempt" if the holder is not required to provide a Working With Children Check (WWCC).
                Further information on these clearances can be found on our <NextLink href="/info">information page</NextLink>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What are the clearance statuses and what do they mean?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The status of your clearance indicates whether your clearance is valid and can be used to sign in on site.
              </Typography>
              <ul>
                <li><strong>Applied</strong> - Your clearance application has been received and will be reviewed by our team shortly.</li>
                <li><strong>In Progress</strong> - Your clearance is being reviewed. Our team may contact you if more information is required.</li>
                <li><strong>Cleared</strong> - Your clearance has been reviewed by our team and can be used at the locations listed on your clearance.</li>
                <li><strong>Under 18</strong> - Your clearance is valid while you are under 18 years old.</li>
                <li><strong>Renewing</strong> - Your clearance has updates that are being reviewed by our team.</li>
                <li><strong>Expiring</strong> - Your clearance is nearing its expiration date and may need to be renewed soon.</li>
                <li><strong>Expired</strong> - Your clearance has expired and is no longer valid for use on site. You will need to renew your clearance before you can continue using it.</li>
                <li><strong>Closed</strong> - Your clearance has been closed and cannot be used.</li>
                <li><strong>Declined</strong> - Your clearance has been declined and cannot be used.</li>
              </ul>
              <Typography>
                If you believe your clearance status is incorrect or have any questions please contact us.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">How do I change or update my details?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              By signing in to this online portal you can view and manage your personal details and clearances. Click <NextLink href="/">here</NextLink> to sign in.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What is "upgrading" a clearance?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{mb:2}}>
              Upgrading a clearance enables you to engage in work or volunteering that requires a Working with Children Check (WWCC). This process is only applicable to "Exempt" clearances and converts them to standard clearances (i.e. "Volunteer Exempt" becomes "Volunteer").
            </Typography>
            <Typography sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
              To begin the upgrade process, please select the <Upgrade /> icon next to the relevant clearance in the{'\u00A0'}<NextLink href="/">self-service</NextLink>{'\u00A0'}portal.
              </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mb:2}}>
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
            </Typography>
            <ul>
              <li>Ask some questions about the nature of your visit</li>
              <li>Determine what clearance is appropriate for your visit and what information we need to collect from you</li>
              <li>Provide important information relevant to your visit</li>
              <li>Ask for your agreement to keep our schools a safe environment for everyone</li>
            </ul>
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

      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mb:2}}>
          Signing In
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Where do I sign in?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              When you visit any of our sites you will need to sign in at the front office or reception area.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">How do I sign in?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              When you arrive at the front office or reception area you will need to sign in on the iPad located near the front counter.
              <br/><br/>
              The email you recieved containing your CEDoW Token includes instructions for signing in. We highly recommend installing our Quick Sign In app on your mobile device to make this process quick and easy. 
              <br/><br/>
              If you have any issues signing in please ask a staff member for assistance.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Why do I need to sign in?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              It is a requirement that all visitors sign in when they arrive on site.
              <br/><br/>
              Signing in helps us keep track of who is on site at any given time. This is important for safety and security reasons, as well as for compliance with relevant regulations and legislation. In the event of an emergency, having an accurate record of who is on site allows us to ensure everyone is accounted for and safe.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Box sx={{mb:3}}>
        <Typography variant="h6" sx={{mb:2}}>
          Working With Children Check (WWCC)
        </Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">What is a Working With Children Check (WWCC)?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              A Working With Children Check (WWCC) is a background check required for anyone who will be undertaking child-related work.
              <br/><br/>
              If you have any questions about Working With Children Checks (WWCCs) please visit the Office of the Children's Guardian <NextLink href={process.env.NEXT_PUBLIC_OCG_FAQ_URL??''} target='_blank, noreferrer'>FAQ page</NextLink>.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Why do you need my Working With Children Check (WWCC)?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The Office of the Children's Guardian requires us to verify the validity of your Working With Children Check (WWCC) if you will be undertaking child-related work while on site.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Do I need a Working With Children Check (WWCC)?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you will be undertaking child-related paid or unpaid work you will need to provide a valid Working With Children Check (WWCC) and we will need to verify it.
              <br/><br/>
              The questions asked in the induction will determine whether the nature of your work or volunteering is child-related and requires a Working With Children Check (WWCC).
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">How do I get or renew a Working With Children Check (WWCC)?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you do not have a Working With Children Check (WWCC) you will need to apply for one. If you have an existing WWCC that is expiring or has expired you will need to renew it. Information for applying or renewing a WWCC can be found on the <NextLink href={process.env.NEXT_PUBLIC_OCG_URL??''} target='_blank, noreferrer'>Office of the Children's Guardian website</NextLink>.
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