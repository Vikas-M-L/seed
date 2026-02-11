import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Samsung Enterprise Design System Colors


// Create base theme
let theme = createTheme({
  palette: {
    primary: {
      main: "#0284c7",   // Bright Blue (Icons)
      light: "#38bdf8",
      dark: "#0369a1",
    },
    secondary: {
      main: "#06B6D4",   // Cyan/Teal
      light: "#22D3EE",
      dark: "#0891B2",
    },
    success: {
      main: "#22C55E",   // Green
      light: "#86EFAC",
      dark: "#16A34A",
    },
    warning: {
      main: "#F59E0B",   // Amber
      light: "#FCD34D",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444",   // Red
      light: "#F87171",
      dark: "#DC2626",
    },
    info: {
      main: "#0EA5E9",   // Sky blue
      light: "#38BDF8",
      dark: "#0284C7",
    },
    background: {
      default: "#F3F4F6", // Will be overridden by CSS baseline for body
      paper: "rgba(255, 255, 255, 0.5)", // Semi-transparent by default
    },
    text: {
      primary: "#334155", // Body Text (Dark Gray)
      secondary: "#64748b", // Muted text
    },
    divider: 'rgba(2, 132, 199, 0.1)',
  },
  typography: {
    fontFamily: "'Roboto', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
      color: '#075985', // Heading color
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
      color: '#075985',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#075985',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#075985',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#075985',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#075985',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#334155', // Body text
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      color: '#334155',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 600,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
      color: '#64748b',
    },
  },
  spacing: 8, // 8px grid system
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 6px 8px rgba(0, 0, 0, 0.1)',
    '0px 8px 12px rgba(0, 0, 0, 0.1)',
    '0px 10px 16px rgba(0, 0, 0, 0.1)',
    '0px 12px 20px rgba(0, 0, 0, 0.1)',
    '0px 14px 24px rgba(0, 0, 0, 0.1)',
    '0px 16px 28px rgba(0, 0, 0, 0.1)',
    '0px 18px 32px rgba(0, 0, 0, 0.1)',
    '0px 20px 36px rgba(0, 0, 0, 0.1)',
    '0px 22px 40px rgba(0, 0, 0, 0.1)',
    '0px 24px 44px rgba(0, 0, 0, 0.1)',
    '0px 26px 48px rgba(0, 0, 0, 0.1)',
    '0px 28px 52px rgba(0, 0, 0, 0.15)',
    '0px 30px 56px rgba(0, 0, 0, 0.15)',
    '0px 32px 60px rgba(0, 0, 0, 0.15)',
    '0px 34px 64px rgba(0, 0, 0, 0.15)',
    '0px 36px 68px rgba(0, 0, 0, 0.15)',
    '0px 38px 72px rgba(0, 0, 0, 0.15)',
    '0px 40px 76px rgba(0, 0, 0, 0.15)',
    '0px 42px 80px rgba(0, 0, 0, 0.2)',
    '0px 44px 84px rgba(0, 0, 0, 0.2)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #67e8f9 0%, #ddd6fe 50%, #c4b5fd 100%)',
          minHeight: '100vh',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F1F3F5',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CED4DA',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#ADB5BD',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(2, 132, 199, 0.2)', // Ice blue border
          background: 'rgba(224, 242, 254, 0.5)', // Ice blue glass effect
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '20px 24px 12px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
        subheader: {
          fontSize: '0.8125rem',
          color: '#6C757D',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#DEE2E6',
            },
            '&:hover fieldset': {
              borderColor: '#0066CC',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0066CC',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E9ECEF',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8F9FA',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: '#495057',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '2px solid #DEE2E6',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#FAFBFC',
          },
          '&:hover': {
            backgroundColor: '#F1F3F5',
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '14px 16px',
          borderBottom: '1px solid #E9ECEF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        filled: {
          '&.MuiChip-colorSuccess': {
            backgroundColor: '#D4EDDA',
            color: '#155724',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: '#FFF3CD',
            color: '#856404',
          },
          '&.MuiChip-colorError': {
            backgroundColor: '#F8D7DA',
            color: '#721C24',
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: '#D1ECF1',
            color: '#0C5460',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#212529',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E9ECEF',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 102, 204, 0.08)',
            color: '#0066CC',
            '& .MuiListItemIcon-root': {
              color: '#0066CC',
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 102, 204, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
          padding: '24px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
        },
        standardSuccess: {
          backgroundColor: '#D4EDDA',
          color: '#155724',
        },
        standardError: {
          backgroundColor: '#F8D7DA',
          color: '#721C24',
        },
        standardWarning: {
          backgroundColor: '#FFF3CD',
          color: '#856404',
        },
        standardInfo: {
          backgroundColor: '#D1ECF1',
          color: '#0C5460',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#343A40',
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '8px 12px',
        },
        arrow: {
          color: '#343A40',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
        // Apply glass effect to all default papers if not overridden
        root: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
        }
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
  },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
