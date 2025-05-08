// src/theme/uddanTheme.js
import { createTheme } from '@mui/material/styles';

// UDDAN brand color palette
const colors = {
  primary: {
    main: '#0066CC',
    light: '#4D94E0',
    dark: '#004C99',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF5722',
    light: '#FF8A65',
    dark: '#E64A19',
    contrastText: '#FFFFFF',
  },
  accent: {
    blue: '#1A73E8',
    teal: '#00ACC1',
    orange: '#FF9800',
  },
  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
    light: '#F9FAFC',
    dark: '#172B4D',
  },
  text: {
    primary: '#172B4D',
    secondary: '#5E6C84',
    disabled: '#A5ADBA',
  },
  success: {
    main: '#36B37E',
    light: '#79F2C0',
    dark: '#006644',
  },
  error: {
    main: '#FF5630',
    light: '#FF8F73',
    dark: '#DE350B',
  },
  warning: {
    main: '#FFAB00',
    light: '#FFE380',
    dark: '#FF8B00',
  },
  info: {
    main: '#0065FF',
    light: '#4C9AFF',
    dark: '#0747A6',
  },
};

// Create custom MUI theme based on UDDAN's branding
const uddanTheme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.06),0px 5px 8px 0px rgba(0,0,0,0.05),0px 1px 14px 0px rgba(0,0,0,0.07)',
    '0px 4px 5px -2px rgba(0,0,0,0.06),0px 7px 10px 1px rgba(0,0,0,0.05),0px 2px 16px 1px rgba(0,0,0,0.07)',
    '0px 6px 10px -3px rgba(0,0,0,0.07),0px 10px 14px 1px rgba(0,0,0,0.06),0px 4px 18px 3px rgba(0,0,0,0.08)',
    // ... rest of the shadows
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          padding: '10px 20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(45deg, ${colors.secondary.dark} 0%, ${colors.secondary.main} 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: '12px',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        },
      },
    },
  },
});

export default uddanTheme;