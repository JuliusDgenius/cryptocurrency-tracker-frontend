import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      feature: string;
      ctasection: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      customcolor?: string;
      ctasection: string;
      feature: string;
    };
  }
}