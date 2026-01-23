import Typography from '@mui/material/Typography';

const ContactUs = ({
  text = 'Contact us at:',
  style
}: { text?: string, style?: React.CSSProperties }) => {
  return (
    <Typography variant='body1' sx={{color: 'grey', whiteSpace: 'pre-line', ...style}}>
      {`${text}
      E | ${process.env.NEXT_PUBLIC_WWC_EMAIL}
      P | ${process.env.NEXT_PUBLIC_WWC_PHONE}
      `}
    </Typography>
  )
}

export default ContactUs;