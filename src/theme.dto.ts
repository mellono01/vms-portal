export interface StatusColors {
  orange: string;
  green: string;
  red: string;
  yellow: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    cedowColors: CedowPaletteOptions;
    statusColors?: StatusColors
  }
  interface PaletteOptions {
    cedowColors: CedowPaletteOptions;
    statusColors?: StatusColors;
  }
}