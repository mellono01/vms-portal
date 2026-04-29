import { Box, Typography, styled } from "@mui/material";
import Link from "next/link";

import InductionStepper from "./InductionStepper";

const BodyText = styled(Typography)(({ theme }) => ({
  width: '90%',
  [theme.breakpoints.up('sm')]: {
    width: '70%',
  },
  textAlign: 'center',
}));

export default function Info() {
  return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <Typography variant="h6" sx={{mb:2, width: '95%', textAlign: 'center'}}>
          We are committed to ensuring the safety and well-being of all staff, students and visitors in our schools.
        </Typography>
        <BodyText sx={{mb:2}}>
        As part of this commitment all visitors to our sites must complete a short online induction <strong>once</strong> and sign in using their issued CEDoW Token when arriving on site.
        </BodyText>
        <InductionStepper />
        {/* <BodyText sx={{mb:2}}>
          For more information on how we handle your personal information please see our privacy policy.
        </BodyText> */}
        <BodyText sx={{mb:5}}>
          If you have any questions please read the <Link href="/info/faq">Frequently Asked Questions (FAQs)</Link> or contact us:<br/><br/>
          P | {process.env.NEXT_PUBLIC_WWC_PHONE} (Monday to Friday, 9am to 5pm) <br />
          E | {process.env.NEXT_PUBLIC_WWC_EMAIL}
        </BodyText>
        <BodyText sx={{mb:5, fontSize: '18px'}}>
          <strong>Thank you for helping keep our schools a safe environment for everyone.</strong>
        </BodyText>
      </Box>
  );
}