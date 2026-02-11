import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthStore } from '@/stores/authStore';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Set dark mode when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            setIsDarkMode(true);
        }
    }, [isAuthenticated]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? 'dark' : 'light',
                    primary: {
                        main: isDarkMode ? '#38bdf8' : '#8b5cf6',
                        light: isDarkMode ? '#7dd3fc' : '#a78bfa',
                        dark: isDarkMode ? '#0284c7' : '#7c3aed',
                    },
                    secondary: {
                        main: isDarkMode ? '#818cf8' : '#a78bfa',
                        light: isDarkMode ? '#a78bfa' : '#c4b5fd',
                        dark: isDarkMode ? '#6366f1' : '#8b5cf6',
                    },
                    background: {
                        default: isDarkMode ? '#0f172a' : '#faf5ff',
                        paper: isDarkMode ? '#1e293b' : '#ffffff',
                    },
                    text: {
                        primary: isDarkMode ? '#e2e8f0' : '#1e1b4b',
                        secondary: isDarkMode ? '#94a3b8' : '#6b7280',
                        disabled: isDarkMode ? '#475569' : '#cbd5e1',
                    },
                    success: {
                        main: isDarkMode ? '#10b981' : '#22c55e',
                        light: isDarkMode ? '#34d399' : '#4ade80',
                        dark: isDarkMode ? '#059669' : '#16a34a',
                    },
                    warning: {
                        main: isDarkMode ? '#f59e0b' : '#f97316',
                        light: isDarkMode ? '#fbbf24' : '#fb923c',
                        dark: isDarkMode ? '#d97706' : '#ea580c',
                    },
                    error: {
                        main: isDarkMode ? '#ef4444' : '#dc2626',
                        light: isDarkMode ? '#f87171' : '#ef4444',
                        dark: isDarkMode ? '#dc2626' : '#b91c1c',
                    },
                    info: {
                        main: isDarkMode ? '#3b82f6' : '#2563eb',
                        light: isDarkMode ? '#60a5fa' : '#3b82f6',
                        dark: isDarkMode ? '#2563eb' : '#1d4ed8',
                    },
                },
                typography: {
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    h1: {
                        fontWeight: 800,
                        fontSize: '2.5rem',
                    },
                    h2: {
                        fontWeight: 700,
                        fontSize: '2rem',
                    },
                    h3: {
                        fontWeight: 700,
                        fontSize: '1.75rem',
                    },
                    h4: {
                        fontWeight: 700,
                        fontSize: '1.5rem',
                    },
                    h5: {
                        fontWeight: 600,
                        fontSize: '1.25rem',
                    },
                    h6: {
                        fontWeight: 600,
                        fontSize: '1rem',
                    },
                },
                shape: {
                    borderRadius: 12,
                },
                shadows: [
                    'none',
                    isDarkMode
                        ? '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3)'
                        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    isDarkMode
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    isDarkMode
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    isDarkMode
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    isDarkMode
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                ] as const,
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                background: isDarkMode
                                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
                                    : 'linear-gradient(135deg, #a78bfa 0%, #818cf8 20%, #60a5fa 40%, #38bdf8 60%, #818cf8 80%, #a78bfa 100%)',
                                backgroundAttachment: 'fixed',
                                minHeight: '100vh',
                                transition: 'background 0.5s ease',
                            },
                            '#root': {
                                minHeight: '100vh',
                                background: 'transparent',
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 12,
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                            },
                        },
                    },
                },
            }),
        [isDarkMode]
    );

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
