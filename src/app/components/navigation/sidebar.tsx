import * as React from 'react';

import { styled, useTheme } from '@mui/material/styles';

import {
    List,
    Divider,
    Drawer,
    IconButton,
    Link,
    ListItem,
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
    ListItemText as MuiListItemText,
    Tooltip
} from '@mui/material';

import {
    Close as CloseIcon
} from '@mui/icons-material';

import {menuItems} from '@components/navigation/menuItems'
import useWindowSize from '@hooks/useWindowSize'

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar, // necessary for content to be below app bar
    [theme.breakpoints.up('sm')]: {
        justifyContent: 'flex-start',
    },
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-end',
    }
}));

interface ListItemLinkProps extends ListItemButtonProps {
    to: string;
}

const ListItemLink = ({ to, ...props }: ListItemLinkProps) => {
    return <ListItemButton component={Link} to={to} {...props} />;
}

const ListItemText = styled(MuiListItemText)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

export default function Sidebar({
    isOpen,
    toggle,
  }: {
    isOpen: boolean;
    toggle: () => void;
  }): JSX.Element {
    const theme = useTheme();
    const windowSize: WindowSize = useWindowSize();

    return (
        <Drawer
            sx={{
                [theme.breakpoints.up('sm')]: {
                    width: process.env.NEXT_PUBLIC_SIDE_BAR_WIDTH+'px',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: process.env.NEXT_PUBLIC_SIDE_BAR_WIDTH+'px',
                    },
                },
                [theme.breakpoints.down('sm')]: {
                    width: windowSize.width+'px',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: windowSize.width+'px',
                    },
                }
            }}
            variant="temporary"
            anchor="right"
            open={isOpen}
            onClose={toggle}
        >
            <DrawerHeader>
                <Tooltip title="Close">
                    <IconButton onClick={toggle}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </DrawerHeader>
            <Divider />
            <List>
                {
                    menuItems.map(item => {
                        return <ListItem key={item.path} disablePadding>
                            <ListItemLink 
                                key={item.title}
                                component={Link}
                                to={process.env.NEXT_PUBLIC_BASE_PATH + item.path}
                            >
                                <ListItemIcon>
                                    <item.icon/>
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemLink>
                        </ListItem>
                    })
                }
            </List>
        </Drawer>
    );
}