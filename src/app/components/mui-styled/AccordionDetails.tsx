import { styled } from '@mui/material/styles';

import {
    AccordionDetails as MuiAccordionDetails
} from '@mui/material';

export const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    ...theme.applyStyles('light', {
        backgroundColor: 'var(--mui-palette-grey-200)'
    }),
}))