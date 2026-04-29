"use client"

import { 
  Box, 
  Typography
} from "@mui/material";

export default function ErrorPage() {

  return (
    <Box>
      <Typography variant="h4" align="center" sx={{ mt: 5 }}>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" align="center" sx={{ mt: 2 }}>
        Please try refreshing the page or contact support if the issue persists.
      </Typography>
    </Box>
  )
}