import { styled } from '@mui/material/styles';

import {
    Avatar
} from '@mui/material';

export const UserAvatar = styled(Avatar)(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        width: '35px',
        height: '35px',
        fontSize: '18px'
    },
}))