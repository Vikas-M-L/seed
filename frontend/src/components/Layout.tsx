import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip,
  Badge,
  Chip,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  AdminPanelSettings as AdminIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { useThemeMode } from '@/contexts/ThemeContext';
import { UserRole } from '@/types';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 72;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

interface NavItemExtended extends NavItem {
  color?: string;
}

const navItems: NavItemExtended[] = [
  // Lab Member Routes
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/member/dashboard',
    roles: ['LAB_MEMBER'],
    color: '#6366F1',
  },
  {
    label: 'My Attendance',
    icon: <CalendarIcon />,
    path: '/member/attendance',
    roles: ['LAB_MEMBER'],
    color: '#06B6D4',
  },
  {
    label: 'Salary Slips',
    icon: <ReceiptIcon />,
    path: '/member/salary-slips',
    roles: ['LAB_MEMBER'],
    color: '#22C55E',
  },
  {
    label: 'Leave Applications',
    icon: <CalendarIcon />,
    path: '/member/leaves',
    roles: ['LAB_MEMBER'],
    color: '#EC4899',
  },
  {
    label: 'Profile',
    icon: <PersonIcon />,
    path: '/member/profile',
    roles: ['LAB_MEMBER'],
    color: '#F59E0B',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/member/settings',
    roles: ['LAB_MEMBER'],
    color: '#8B5CF6',
  },

  // Admin Routes
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/admin/dashboard',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Lab Members',
    icon: <PeopleIcon />,
    path: '/admin/members',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Attendance',
    icon: <CalendarIcon />,
    path: '/admin/attendance',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Salary Management',
    icon: <ReceiptIcon />,
    path: '/admin/salary',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Shift & Roster',
    icon: <ScheduleIcon />,
    path: '/admin/shift-roster',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Overtime & Hours',
    icon: <AccessTimeIcon />,
    path: '/admin/overtime',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Payroll',
    icon: <ReceiptIcon />,
    path: '/admin/payroll',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Reports',
    icon: <AssessmentIcon />,
    path: '/admin/reports',
    roles: ['LAB_ADMIN'],
  },
  {
    label: 'Announcements',
    icon: <NotificationsIcon />,
    path: '/admin/announcements',
    roles: ['LAB_ADMIN', 'SUPER_ADMIN'],
  },

  // Super Admin Routes
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/super-admin/dashboard',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Labs',
    icon: <BusinessIcon />,
    path: '/super-admin/labs',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Users',
    icon: <PeopleIcon />,
    path: '/super-admin/users',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Leave Applications',
    icon: <CalendarIcon />,
    path: '/super-admin/leaves',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/super-admin/settings',
    roles: ['SUPER_ADMIN'],
  },
];

const Layout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Chip label="Super Admin" size="small" color="error" sx={{ fontSize: '0.65rem', height: 20 }} />;
      case 'LAB_ADMIN':
        return <Chip label="Admin" size="small" color="primary" sx={{ fontSize: '0.65rem', height: 20 }} />;
      default:
        return <Chip label="Member" size="small" color="default" sx={{ fontSize: '0.65rem', height: 20 }} />;
    }
  };

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role));

  const drawerWidth = collapsed && !isMobile ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: isDarkMode
        ? `linear-gradient(180deg, 
          ${alpha(theme.palette.primary.main, 0.15)} 0%, 
          ${alpha('#1e293b', 0.98)} 25%,
          ${alpha('#1e293b', 0.98)} 85%,
          ${alpha(theme.palette.secondary.main, 0.15)} 100%)`
        : `linear-gradient(180deg, 
          ${alpha(theme.palette.primary.main, 0.12)} 0%, 
          ${alpha('#ffffff', 0.95)} 25%,
          ${alpha('#ffffff', 0.95)} 85%,
          ${alpha(theme.palette.secondary.main, 0.12)} 100%)`,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 60%)`,
        pointerEvents: 'none',
      },
    }}>
      {/* Logo Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
          p: 2,
          minHeight: 64,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {(!collapsed || isMobile) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.25rem',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.05) rotate(-3deg)',
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              AE
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, background: 'linear-gradient(90deg, #6366F1, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Attend Ease
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600 }}>
                SEED Labs Portal
              </Typography>
            </Box>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}>
            <ChevronLeftIcon sx={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', color: 'primary.main' }} />
          </IconButton>
        )}
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2, position: 'relative', zIndex: 1 }}>
        <List disablePadding>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const itemColor = (item as NavItemExtended).color || theme.palette.primary.main;

            return (
              <ListItem key={item.path} disablePadding sx={{ px: 1.5, mb: 1 }}>
                <Tooltip title={collapsed && !isMobile ? item.label : ''} placement="right">
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 2.5,
                      minHeight: 52,
                      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                      px: collapsed && !isMobile ? 1.5 : 2,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: isActive
                        ? `linear-gradient(90deg, ${alpha(itemColor, 0.15)}, ${alpha(itemColor, 0.05)})`
                        : 'transparent',
                      border: `2px solid ${isActive ? alpha(itemColor, 0.3) : 'transparent'}`,
                      '&:hover': {
                        background: isActive
                          ? `linear-gradient(90deg, ${alpha(itemColor, 0.2)}, ${alpha(itemColor, 0.1)})`
                          : alpha(itemColor, 0.08),
                        border: `2px solid ${alpha(itemColor, 0.2)}`,
                        transform: 'translateX(4px)',
                        boxShadow: `0 4px 12px ${alpha(itemColor, 0.15)}`,
                      },
                      '&::before': isActive ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '60%',
                        background: `linear-gradient(180deg, ${itemColor}, ${alpha(itemColor, 0.5)})`,
                        borderRadius: '0 4px 4px 0',
                      } : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed && !isMobile ? 0 : 44,
                        justifyContent: 'center',
                        color: isActive ? itemColor : 'text.secondary',
                        fontSize: 24,
                        transition: 'all 0.3s',
                        '& > svg': {
                          filter: isActive ? `drop-shadow(0 2px 4px ${alpha(itemColor, 0.4)})` : 'none',
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {(!collapsed || isMobile) && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? itemColor : 'text.primary',
                        }}
                      />
                    )}
                    {isActive && (!collapsed || isMobile) && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${itemColor}, ${alpha(itemColor, 0.5)})`,
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                            '50%': { opacity: 0.7, transform: 'scale(1.2)' },
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Info Section */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
          gap: 1.5,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Avatar
          src={user?.avatarUrl}
          alt={user?.name}
          sx={{
            width: 44,
            height: 44,
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            fontSize: '0.9rem',
            fontWeight: 700,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            border: `2px solid ${alpha(theme.palette.common.white, 0.8)}`,
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        {(!collapsed || isMobile) && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', fontWeight: 500 }}>
              {user?.email}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'transparent', position: 'relative', overflow: 'hidden' }}>
      {/* DECORATIVE BACKGROUND ELEMENTS */}
      <Box
        sx={{
          position: 'fixed',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: isDarkMode
            ? `radial-gradient(circle, ${alpha('#38bdf8', 0.08)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha('#a78bfa', 0.25)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'pulse 8s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
            '50%': { opacity: 0.8, transform: 'scale(1.1)' },
          },
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          bottom: '-10%',
          left: '-5%',
          width: '35%',
          height: '35%',
          borderRadius: '50%',
          background: isDarkMode
            ? `radial-gradient(circle, ${alpha('#818cf8', 0.08)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha('#818cf8', 0.25)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'pulse 10s ease-in-out infinite reverse',
        }}
      />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: isDarkMode ? alpha('#1e293b', 0.8) : alpha('#ffffff', 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, isDarkMode ? 0.2 : 0.1)}`,
          boxShadow: isDarkMode
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.02)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {filteredNavItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user && getRoleBadge(user.role)}

            <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  color: 'text.secondary',
                  bgcolor: isDarkMode ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: isDarkMode ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.secondary' }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton onClick={handleProfileMenuOpen}>
                <Avatar
                  src={user?.avatarUrl}
                  alt={user?.name}
                  sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.875rem' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/member/profile'); }}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        {(user?.role === 'LAB_ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin/dashboard'); }}>
            <ListItemIcon><AdminIcon fontSize="small" /></ListItemIcon>
            Admin Panel
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar Drawer - Mobile */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar Drawer - Desktop */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: 0 },
          minHeight: '100vh',
          pt: '64px',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
