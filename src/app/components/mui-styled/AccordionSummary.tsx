import { styled } from '@mui/material/styles';

import {
    AccordionSummary as MuiAccordionSummary
} from '@mui/material';

export const AccordionSummary = styled(MuiAccordionSummary)(({theme}) => ({
    ...theme.applyStyles('light', {
        backgroundColor: 'var(--mui-palette-grey-500)'
    }),
}))