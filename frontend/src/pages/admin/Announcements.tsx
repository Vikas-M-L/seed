import React, { useState } from 'react'; // Removed useEffect
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Stack,
  Alert,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
// Removed useAnnouncementStore
import { Announcement, CreateAnnouncementRequest, UpdateAnnouncementRequest } from '@/types';

const AnnouncementsManagement: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch Announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      // Assuming GET /announcements returns the list
      const response = await api.get('/announcements');
      return (response.data.data || response.data) as Announcement[];
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementRequest) => api.post('/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      handleCloseDialog();
    },
    onError: (error) => {
      alert('Failed to create announcement');
      console.error(error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnouncementRequest }) =>
      api.put(`/announcements/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      handleCloseDialog();
    },
    onError: (error) => {
      alert('Failed to update announcement');
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      alert('Failed to delete announcement');
      console.error(error);
    }
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAnnouncementRequest>({
    title: '',
    description: '',
    content: '',
    priority: 'MEDIUM',
    targetType: 'ALL',
    targetLabIds: [],
    targetMemberIds: [],
  });

  const handleOpenDialog = (announcement?: Announcement) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({
        title: announcement.title,
        description: announcement.description,
        content: announcement.content,
        priority: announcement.priority,
        expiresAt: announcement.expiresAt,
        targetType: announcement.targetType,
        targetLabIds: announcement.targetLabIds || [],
        targetMemberIds: announcement.targetMemberIds || [],
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        priority: 'MEDIUM',
        targetType: 'ALL',
        targetLabIds: [],
        targetMemberIds: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      priority: 'MEDIUM',
      targetType: 'ALL',
      targetLabIds: [],
      targetMemberIds: [],
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: { ...formData, status: 'ACTIVE' } as UpdateAnnouncementRequest
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteMutation.mutate(id);
    }
  };


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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getTargetLabel = (announcement: Announcement): string => {
    switch (announcement.targetType) {
      case 'ALL':
        return 'All Members';
      case 'ADMIN_ONLY':
        return 'Admin Only';
      case 'SPECIFIC_LAB':
        return `Lab ${announcement.targetLabIds?.join(', ')}`;
      case 'SPECIFIC_MEMBERS':
        return `Members (${announcement.targetMemberIds?.length || 0})`;
      default:
        return 'Unknown';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <NotificationsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4">Announcements Management</Typography>
              </Box>
              <Typography color="text.secondary">
                Create and manage announcements for all lab members
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size="large"
            >
              New Announcement
            </Button>
          </Box>
        </Grid>

        {/* Stats */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${theme.palette.primary.main}`,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Announcements
              </Typography>
              <Typography variant="h4">{announcements.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: alpha(theme.palette.success.main, 0.1),
              border: `1px solid ${theme.palette.success.main}`,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active
              </Typography>
              <Typography variant="h4">
                {announcements.filter((a) => !isExpired(a.expiresAt)).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              background: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${theme.palette.error.main}`,
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                High Priority
              </Typography>
              <Typography variant="h4">{announcements.filter((a) => a.priority === 'HIGH').length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements List */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="All Announcements" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {announcements.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <NotificationsIcon
                    sx={{
                      fontSize: 48,
                      color: 'text.disabled',
                      mb: 1,
                    }}
                  />
                  <Typography color="text.secondary">No announcements yet</Typography>
                </Box>
              ) : (
                <List sx={{ width: '100%' }}>
                  {announcements.map((announcement, index) => (
                    <React.Fragment key={announcement.id}>
                      <ListItem
                        sx={{
                          py: 2,
                          px: 3,
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {announcement.priority === 'HIGH' ? (
                            <WarningIcon color="error" />
                          ) : (
                            <NotificationsIcon color="primary" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontWeight: 600 }}>{announcement.title}</Typography>
                              <Chip
                                label={announcement.priority}
                                size="small"
                                color={getPriorityColor(announcement.priority)}
                                variant="outlined"
                              />
                              <Chip
                                label={getTargetLabel(announcement)}
                                size="small"
                                variant="outlined"
                                sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}
                              />
                              {isExpired(announcement.expiresAt) && (
                                <Chip
                                  label="Expired"
                                  size="small"
                                  variant="outlined"
                                  sx={{ color: 'text.disabled' }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {announcement.description}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                By {announcement.createdByName} • {formatDate(announcement.createdAt)}
                                {announcement.expiresAt && ` • Expires: ${formatDate(announcement.expiresAt)}`}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(announcement)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(announcement.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < announcements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{editingId ? 'Edit Announcement' : 'Create New Announcement'}</span>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Announcement title"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full announcement content"
              multiline
              rows={4}
            />
            <TextField
              select
              fullWidth
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH',
                })
              }
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2 }}>
              Send to
            </Typography>
            <TextField
              select
              fullWidth
              label="Target Audience"
              value={formData.targetType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetType: e.target.value as any,
                  targetLabIds: [],
                  targetMemberIds: [],
                })
              }
            >
              <MenuItem value="ALL">All Members</MenuItem>
              <MenuItem value="ADMIN_ONLY">Admin & Super Admin Only</MenuItem>
              <MenuItem value="SPECIFIC_LAB">Specific Lab Members</MenuItem>
              <MenuItem value="SPECIFIC_MEMBERS">Specific Members</MenuItem>
            </TextField>

            {formData.targetType === 'SPECIFIC_LAB' && (
              <TextField
                select
                fullWidth
                label="Select Labs"
                value={formData.targetLabIds?.join(',')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetLabIds: e.target.value.split(',').map(Number),
                  })
                }
                helperText="Select the labs to send this announcement to"
              >
                <MenuItem value="1">Lab 1</MenuItem>
                <MenuItem value="2">Lab 2</MenuItem>
                <MenuItem value="3">Lab 3</MenuItem>
              </TextField>
            )}

            {formData.targetType === 'SPECIFIC_MEMBERS' && (
              <TextField
                select
                fullWidth
                label="Select Members"
                value={formData.targetMemberIds?.join(',')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetMemberIds: e.target.value.split(',').map(Number),
                  })
                }
                helperText="Select the members to send this announcement to"
              >
                <MenuItem value="1">John Doe (Lab 1)</MenuItem>
                <MenuItem value="2">Alice Johnson (Lab 1)</MenuItem>
                <MenuItem value="3">Bob Wilson (Lab 2)</MenuItem>
                <MenuItem value="4">Carol Davis (Lab 2)</MenuItem>
              </TextField>
            )}

            <TextField
              fullWidth
              label="Expires At (Optional)"
              type="datetime-local"
              value={formData.expiresAt || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expiresAt: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
            />
            <Alert severity="info">
              This announcement will be visible to all lab members on their dashboard.
            </Alert>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={isLoading}>
            {editingId ? 'Update' : 'Create'} Announcement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementsManagement;
