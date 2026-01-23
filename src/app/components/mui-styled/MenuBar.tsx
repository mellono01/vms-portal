import { styled } from '@mui/material/styles';

import {
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Typography
} from '@mui/material';

interface MenuBarProps extends MuiAppBarProps {
    open?: boolean;
}

const drawerWidth: number = Number(process.env.NEXT_PUBLIC_SIDE_BAR_WIDTH);

export const MenuBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<MenuBarProps>(({ theme }) => ({
    backgroundColour: theme.palette.primary.main,
    ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.primary.main,
    }),
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginRight: drawerWidth,
            },
        },
    ],
}));

export const MenuTitle = styled(Typography)(({theme}) => ({
    height: '100%', 
    display: 'flex', 
    justifyContent:'center', 
    alignItems: 'center',
    fontWeight: 'bold',
    [theme.breakpoints.down('md')]: {
        fontSize: '20px'
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '24px'
    },
}))

export const MenuLogo = styled('div')(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        width: '110px'
    },
    [theme.breakpoints.up('md')]: {
        width: '150px'
    },
}))