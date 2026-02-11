import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Alert,
  Button,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  NotificationsActive as BellIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  attendanceReminders: boolean;
  salaryNotifications: boolean;
  leaveUpdates: boolean;
  announcementNotifications: boolean;
  weeklyReport: boolean;
}

const MemberSettings: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    attendanceReminders: true,
    salaryNotifications: true,
    leaveUpdates: true,
    announcementNotifications: true,
    weeklyReport: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`notification-settings-${user?.id}`);
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, [user?.id]);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem(`notification-settings-${user?.id}`, JSON.stringify(notifications));
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4">Settings</Typography>
              <Typography color="text.secondary">Manage your preferences and notification settings</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Success Message */}
        {saveSuccess && (
          <Grid size={{ xs: 12 }}>
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              onClose={() => setSaveSuccess(false)}
            >
              Your settings have been saved successfully!
            </Alert>
          </Grid>
        )}

        {/* Notification Preferences */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader
              avatar={<NotificationsIcon />}
              title="Notification Preferences"
              subtitle="Choose how you want to receive updates"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                {/* Email Notifications */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <MailIcon sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>Email Notifications</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive email updates about your account
                        </Typography>
                      </Box>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications')}
                        />
                      }
                      label=""
                    />
                  </Box>

                  {/* Sub-options for Email */}
                  {notifications.emailNotifications && (
                    <Stack spacing={1.5} sx={{ ml: 5 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notifications.attendanceReminders}
                            onChange={() => handleNotificationChange('attendanceReminders')}
                            size="small"
                          />
                        }
                        label="Attendance Reminders - Get notified about attendance updates"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notifications.salaryNotifications}
                            onChange={() => handleNotificationChange('salaryNotifications')}
                            size="small"
                          />
                        }
                        label="Salary Notifications - Updates about salary slips and payroll"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notifications.leaveUpdates}
                            onChange={() => handleNotificationChange('leaveUpdates')}
                            size="small"
                          />
                        }
                        label="Leave Updates - Notifications about leave approvals and rejections"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notifications.announcementNotifications}
                            onChange={() => handleNotificationChange('announcementNotifications')}
                            size="small"
                          />
                        }
                        label="Announcements - New lab announcements and updates"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notifications.weeklyReport}
                            onChange={() => handleNotificationChange('weeklyReport')}
                            size="small"
                          />
                        }
                        label="Weekly Report - Get a weekly summary of your activities"
                      />
                    </Stack>
                  )}
                </Box>

                <Divider />

                {/* Push Notifications */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BellIcon sx={{ color: 'success.main' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>Push Notifications</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Receive instant notifications in the browser
                        </Typography>
                      </Box>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.pushNotifications}
                          onChange={() => handleNotificationChange('pushNotifications')}
                        />
                      }
                      label=""
                    />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ background: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${theme.palette.primary.main}` }}>
            <CardHeader title="Notification Summary" />
            <CardContent>
              <Stack spacing={2}>
                <Paper sx={{ p: 1.5, bgcolor: theme.palette.background.default }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email Notifications
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {notifications.emailNotifications ? '✓ On' : '✗ Off'}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ p: 1.5, bgcolor: theme.palette.background.default }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Push Notifications
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {notifications.pushNotifications ? '✓ On' : '✗ Off'}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ p: 1.5, bgcolor: theme.palette.background.default }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Notification Types
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {Object.values(notifications).filter((v) => v).length} of {Object.keys(notifications).length}
                    </Typography>
                  </Box>
                </Paper>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Changes are saved automatically when you toggle preferences.
                </Alert>

                {hasChanges && (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSaveSettings}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                )}

                {!hasChanges && (
                  <Typography variant="caption" color="success.main" sx={{ textAlign: 'center', mt: 2 }}>
                    ✓ All changes saved
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card sx={{ mt: 3 }}>
            <CardHeader title="Account Information" />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>{user?.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>{user?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>Lab Member</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Lab
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>{user?.labName || 'N/A'}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberSettings;
