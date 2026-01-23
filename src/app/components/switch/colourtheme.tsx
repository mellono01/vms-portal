"use client"

import {
    Stack,
    Switch,
    Tooltip,
} from '@mui/material';

import {
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from '@mui/icons-material';

import { useColorScheme } from '@mui/material/styles';
// import { styled, useColorScheme } from '@mui/material/styles';

// const ThemeSwitch = styled(Switch)(({ theme }) => ({
//     width: 38,
//     height: 18,
//     padding: 0,
//     display: 'flex',
//     '&:active': {
//         '& .MuiSwitch-thumb': {
//             width: 22,
//         },
//         '& .MuiSwitch-switchBase.Mui-checked': {
//             transform: 'translateX(12px)',
//         },
//     },
//     '& .MuiSwitch-switchBase': {
//         padding: 2.3,
//         '&.Mui-checked': {
//             transform: 'translateX(20px)',
//             color: '#fff',
//             '& + .MuiSwitch-track': {
//                 opacity: 1,
//                 backgroundColor: theme.palette.cedowColors.gold,
//                 ...theme.applyStyles('dark', {
//                     backgroundColor: '#177ddc',
//                 }),
//             },
//         },
//     },
//     '& .MuiSwitch-thumb': {
//         boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
//         width: 13,
//         height: 13,
//         borderRadius: 8,
//         transition: theme.transitions.create(['width'], {
//             duration: 200,
//         }),
//     },
//     '& .MuiSwitch-track': {
//         borderRadius: 20 / 2,
//         opacity: 1,
//         backgroundColor: 'rgba(0,0,0,.25)',
//         boxSizing: 'border-box',
//         ...theme.applyStyles('dark', {
//             backgroundColor: 'rgba(255,255,255,.35)',
//         }),
//     },
// }));

export default function ColourThemeSwitch(): JSX.Element {
    const { mode, setMode } = useColorScheme();

    return (
        <Tooltip title="Toggle light/dark theme">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <DarkModeIcon color="action" />
                    <Switch 
                        color="secondary"
                        checked={mode === 'light' ? true : false}
                        onChange={(e) => {
                            setMode(e.target.checked ? 'light' : 'dark')
                        }}
                    />
                    {/* <ThemeSwitch 
                        checked={mode === 'light' ? true : false} 
                        onChange={(e) => {
                            setMode(e.target.checked ? 'light' : 'dark')
                        }}
                    /> */}
                <LightModeIcon color="action" />
            </Stack>
        </Tooltip>
    );
};