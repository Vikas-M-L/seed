import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
// Removing mock data import

const Profile: React.FC = () => {
  const { user: authUser } = useAuthStore();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data.data || response.data;
    }
  });

  const user = userProfile || authUser;

  const profileData = {
    phone: user?.phone || 'Not provided',
    joinDate: user?.createdAt,
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', color: 'error' as const };
      case 'LAB_ADMIN':
        return { label: 'Lab Admin', color: 'primary' as const };
      default:
        return { label: 'Lab Member', color: 'default' as const };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Active', color: 'success' as const };
      case 'INACTIVE':
        return { label: 'Inactive', color: 'default' as const };
      case 'SUSPENDED':
        return { label: 'Suspended', color: 'error' as const };
      default:
        return { label: status, color: 'default' as const };
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#075985' }}>
          My Profile
        </Typography>
        <Typography variant="body2" sx={{ color: '#334155' }}>
          View and manage your account information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              textAlign: 'center',
              background: "rgba(224, 242, 254, 0.5)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(2, 132, 199, 0.2)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ pt: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: '#0284c7', // Bright blue
                  fontSize: '2.5rem',
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h5" sx={{ fontWeight: 700, color: '#075985' }}>
                {user?.name}
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, color: '#334155' }}>
                {user?.email}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                {user?.role && (
                  <Chip
                    label={getRoleBadge(user.role).label}
                    color={getRoleBadge(user.role).color}
                    size="small"
                  />
                )}
                {user?.status && (
                  <Chip
                    label={getStatusBadge(user.status).label}
                    color={getStatusBadge(user.status).color}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                fullWidth
                sx={{
                  color: '#0284c7',
                  borderColor: '#0284c7',
                  '&:hover': {
                    borderColor: '#075985',
                    bgcolor: 'rgba(2, 132, 199, 0.04)',
                  }
                }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Details Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{
            background: "rgba(224, 242, 254, 0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(2, 132, 199, 0.2)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: 3,
          }}>
            <CardHeader
              title={<Typography variant="h6" sx={{ color: '#075985', fontWeight: 700 }}>Account Information</Typography>}
              subheader={<Typography variant="body2" sx={{ color: '#334155' }}>Your personal and work details</Typography>}
            />
            <CardContent>
              <List disablePadding>
                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: '#0284c7' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Full Name"
                    secondary={user?.name || '—'}
                    primaryTypographyProps={{ variant: 'caption', color: '#64748b' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#334155', fontWeight: 500 }}
                  />
                </ListItem>

                <Divider component="li" />

                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon>
                    <EmailIcon sx={{ color: '#0284c7' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Address"
                    secondary={user?.email || '—'}
                    primaryTypographyProps={{ variant: 'caption', color: '#64748b' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#334155', fontWeight: 500 }}
                  />
                </ListItem>

                <Divider component="li" />

                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: '#0284c7' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={profileData.phone}
                    primaryTypographyProps={{ variant: 'caption', color: '#64748b' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#334155', fontWeight: 500 }}
                  />
                </ListItem>

                <Divider component="li" />

                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon>
                    <BusinessIcon sx={{ color: '#0284c7' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Lab"
                    secondary={user?.labName || 'Not assigned'}
                    primaryTypographyProps={{ variant: 'caption', color: '#64748b' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#334155', fontWeight: 500 }}
                  />
                </ListItem>

                <Divider component="li" />

                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon>
                    <BadgeIcon sx={{ color: '#0284c7' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Role"
                    secondary={getRoleBadge(user?.role || '').label}
                    primaryTypographyProps={{ variant: 'caption', color: '#64748b' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#334155', fontWeight: 500 }}
                  />
                </ListItem>

                <Divider component="li" />

                <ListItem sx={{ py: 2 }}>
                  <ListItemIcon>
                    <CalendarIcon sx={{ color: '#0284c7' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Join Date"
                    secondary={profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString('default', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Not available'}
                    primaryTypographyProps={{ variant: 'caption', color: '#64748b' }}
                    secondaryTypographyProps={{ variant: 'body1', color: '#334155', fontWeight: 500 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
