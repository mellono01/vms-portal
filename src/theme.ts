'use client';
import { Lato } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const font = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

const cedowColorPalette: CedowPaletteOptions = {
    blue: '#0D2C6B',
    white: '#FFFFFF',
    silver: '#D1D2D4',
    black: '#231F20',
    aqua: '#188296',
    charcoal: '#4C4C4E',
    gold: '#FBAF3F'
}

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'class'
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: cedowColorPalette.blue
                },
                secondary: {
                    main: cedowColorPalette.gold
                },
                warning: {
                    main: '#F49136'
                },
                cedowColors: cedowColorPalette,
                Avatar: {
                    defaultBg: cedowColorPalette.silver
                },
                background: {
                  default: 'hsla(215, 15%, 97%, 0.5)',
                },
                statusColors: {
                orange: "#f09b4d",
                green: "#26d148",
                red:  "#f55f5f",
                yellow: "#f2d55e",
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: cedowColorPalette.blue
                },
                secondary: {
                    main: cedowColorPalette.gold
                },
                warning: {
                    main: '#F49136'
                },
                background: {
                    default: '#282828',
                    paper: '#282828'
                },
                cedowColors: cedowColorPalette,
                Avatar: {
                    defaultBg: cedowColorPalette.silver
                },
            },
        },
    },
    typography: {
        fontFamily: font.style.fontFamily,
    },
    components: {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: cedowColorPalette.blue
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label': {
                        color: 'var(--mui-palette-text-primary)',
                    },
                    '& label.Mui-focused': {
                        color: 'var(--mui-palette-text-primary)',
                    },
                    '& .MuiInput-underline:after': {
                        bottomBorderColor: 'var(--mui-palette-text-primary)',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'var(--mui-palette-text-primary)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'var(--mui-palette-text-primary)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'var(--mui-palette-text-primary)',
                        },
                    },
                    '& .MuiFilledInput-root': {
                        '&::after': {
                            borderColor: 'var(--mui-palette-text-primary)',
                        },
                    },
                    '& .MuiInput-root': {
                        '&::after': {
                            borderColor: 'var(--mui-palette-text-primary)',
                        },
                    },
                },
            },
        },
    },
});

export default theme;