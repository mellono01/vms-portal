"use client"

// Library Imports
import * as React from 'react';
import {
    Box,
    Button,
    Divider,
    Grid2 as Grid,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import {
    Settings
} from '@mui/icons-material';

// Authentication removed: no useSession, signIn, or signOut

import Image from 'next/image'
import logo from '/public/images/cedowLogo.png'

// Local Imports
import { MenuBar, MenuLogo, MenuTitle } from '@components/mui-styled/MenuBar'
import { UserAvatar } from '@components/mui-styled/UserAvatar'
import ColourThemeSwitch from '@components/switch/colourtheme'

export default function Navbar({
    isOpen,
    toggle,
}: {
    isOpen: boolean;
    toggle: () => void;
}): JSX.Element {
    // Authentication removed: no session

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <MenuBar position="static" open={isOpen}>
            <Toolbar sx={{p:1}}>
                <Box sx={{flexGrow: 1}}>
                    <Grid container>
                        <Grid size={2}>
                            <MenuLogo sx={{position: 'relative', height:"80px"}}>
                                <Image src={logo} alt="Logo" fill style={{objectFit: 'contain'}} priority={true} sizes="(max-width: 150px)"/>
                            </MenuLogo>
                        </Grid>
                        <Grid size={8}>
                            <MenuTitle>
                                {process.env.NEXT_PUBLIC_APPLICATION_NAME} ({process.env.NEXT_PUBLIC_ENVIRONMENT_NAME_SHORT?.toUpperCase()})
                            </MenuTitle>
                        </Grid>
                        <Grid size={2}>
                            <Box sx={{height: '100%', display: 'flex', justifyContent:'end', alignItems: 'center'}}>
                                <Box sx={{alignContent: 'center', ml:1}}>
                                    <Tooltip title="Settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0, mr: {xs:'2px', sm:'2px', md:1, lg:2}}}>
                                            <Settings sx={{color: 'white'}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                            <MenuItem key={"colourScheme"} sx={{m:1}}>
                                                <ColourThemeSwitch />
                                            </MenuItem>
                                        </Box>
                                    </Menu>
                                </Box>
                                {/* <IconButton color="inherit" onClick={toggle}>
                                    <MenuIcon fontSize="large"/>
                                </IconButton> */}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Toolbar>
        </MenuBar>
    );
};