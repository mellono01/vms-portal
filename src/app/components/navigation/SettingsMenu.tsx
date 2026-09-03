"use client"

import {
    Box,
    Button,
    Menu,
    MenuItem,
} from '@mui/material';

// Authentication removed: no useSession, signIn, or signOut
import { signOut } from 'next-auth/react'

// Local Imports
import ColourThemeSwitch from '@components/switch/colourtheme'

export default function SettingsMenu({
    anchor,
    setAnchor,
}: {
    anchor: null | HTMLElement;
    setAnchor: (anchor: null | HTMLElement) => void;
}): JSX.Element {

    const handleCloseUserMenu = () => {
      setAnchor(null);
    };

    return (
      <Menu
        sx={{ mt: '45px' }}
        id="settings-menu"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchor)}
        onClose={handleCloseUserMenu}
      >
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <MenuItem key={"colourScheme"} sx={{m:1}}>
            <ColourThemeSwitch />
          </MenuItem>
          <MenuItem key={"signout"} sx={{m:1}}>
            <Button onClick={() => {signOut()}}>
              Sign Out
            </Button>
          </MenuItem>
        </Box>
      </Menu>
    );
};

