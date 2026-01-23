import '@mui/material/styles'

declare module '@mui/material/styles' {
    interface Palette {
        cedowColors: CedowPaletteOptions;
    }

    interface PaletteOptions {
        cedowColors: CedowPaletteOptions;
    }
}