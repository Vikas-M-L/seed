import React, { useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Skeleton,
  Alert,
  List,
  ListItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useAnnouncementStore } from '@/stores/announcementStore';
import { useAuthStore } from '@/stores/authStore';

const AnnouncementSlot: React.FC = () => {
  const theme = useTheme();
  const { announcements, isLoading, fetchAnnouncements } = useAnnouncementStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Filter announcements based on user role and lab membership
  const filteredAnnouncements = useMemo(() => {
    if (!user) return [];

    return announcements.filter((announcement) => {
      // Check if announcement is expired
      if (announcement.expiresAt && new Date(announcement.expiresAt) < new Date()) {
        return false;
      }

      switch (announcement.targetType) {
        case 'ALL':
          return true;

        case 'ADMIN_ONLY':
          return user.role === 'LAB_ADMIN' || user.role === 'SUPER_ADMIN';

        case 'SPECIFIC_LAB':
          return (
            user.labId &&
            announcement.targetLabIds &&
            announcement.targetLabIds.includes(user.labId)
          );

        case 'SPECIFIC_MEMBERS':
          return (
            announcement.targetMemberIds &&
            announcement.targetMemberIds.includes(user.id)
          );

        default:
          return false;
      }
    });
  }, [announcements, user]);

  const getPriorityColor = (
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (priority) {
      case 'HIGH':
        return <WarningIcon sx={{ color: theme.palette.error.main }} />;
      case 'MEDIUM':
        return <InfoIcon sx={{ color: theme.palette.warning.main }} />;
      case 'LOW':
        return <SuccessIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading && filteredAnnouncements.length === 0) {
    return (
      <Card
        sx={{
          background: alpha(theme.palette.primary.main, 0.02),
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardHeader
          avatar={<NotificationsIcon />}
          title="Announcements"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: alpha(theme.palette.primary.main, 0.02),
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardHeader
        avatar={<NotificationsIcon />}
        title="Announcements"
        titleTypographyProps={{ variant: 'h6' }}
        action={
          filteredAnnouncements.length > 0 && (
            <Chip label={`${filteredAnnouncements.length} New`} size="small" color="primary" variant="outlined" />
          )
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {filteredAnnouncements.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon
              sx={{
                fontSize: 48,
                color: 'text.disabled',
                mb: 1,
              }}
            />
            <Typography color="text.secondary">No announcements at the moment</Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
            {filteredAnnouncements.slice(0, 5).map((announcement, index) => (
              <React.Fragment key={announcement.id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <Box sx={{ mt: 0.5 }}>{getPriorityIcon(announcement.priority)}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: 'text.primary',
                          }}
                        >
                          {announcement.title}
                        </Typography>
                        <Chip
                          label={announcement.priority}
                          size="small"
                          color={getPriorityColor(announcement.priority)}
                          variant="outlined"
                        />
                        {announcement.targetType !== 'ALL' && (
                          <Chip
                            label={
                              announcement.targetType === 'ADMIN_ONLY'
                                ? 'Admin Only'
                                : announcement.targetType === 'SPECIFIC_LAB'
                                ? 'Lab Only'
                                : 'Personal'
                            }
                            size="small"
                            variant="outlined"
                            sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.85rem',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                      >
                        {announcement.description}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.8rem',
                          color: 'text.disabled',
                          mb: 0.5,
                        }}
                      >
                        By {announcement.createdByName} • {formatDate(announcement.createdAt)}
                      </Typography>
                      {announcement.expiresAt && (
                        <Alert
                          severity="info"
                          sx={{
                            py: 0.5,
                            px: 1,
                            fontSize: '0.75rem',
                            mt: 1,
                          }}
                        >
                          Expires: {formatDate(announcement.expiresAt)}
                        </Alert>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      borderRadius: 1,
                      p: 1.5,
                      width: '100%',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      mt: 1,
                    }}
                  >
                    {announcement.content}
                  </Box>
                </ListItem>
                {index < announcements.slice(0, 5).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementSlot;
