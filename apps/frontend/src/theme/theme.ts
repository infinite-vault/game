import { createTheme, LinkProps } from '@mui/material';
import { LinkBehavior } from '../components/Link/LinkBehavior';

export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 720,
    lg: 1200,
    xl: 1536,
  },
};

export const theme = createTheme({
  breakpoints,
  palette: {
    mode: 'dark',
  },
  spacing: 10,
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        LinkComponent: LinkBehavior,
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        * {
          box-sizing: border-box;
        }
        html {
          -webkit-font-smoothing: antialiased;
        }
      `,
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
  },
});
