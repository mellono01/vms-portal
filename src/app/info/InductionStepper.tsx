import NextLink from "next/link";

import { 
  Box, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel as MuiStepLabel,
  StepContent, 
  Typography, 
  styled
} from "@mui/material";

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

export default function InductionStepper() {
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