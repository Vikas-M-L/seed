import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Chip,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Block as SuspendIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataTable, StatCard } from '@/components';
import { User, UserRole, UserStatus } from '@/types';

// Onboarding Wizard Component (Simplified for now)
const OnboardingWizard = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'LAB_MEMBER',
    employeeId: '',
    designation: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newUser: any) => api.post('/users', newUser), // Assuming endpoint is /users (Super Admin)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'LAB_MEMBER',
        employeeId: '',
        designation: '',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0],
      });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      // specific error handling can be added here
    }
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    createMutation.mutate({
      ...formData,
      password: 'password123', // Default password or handle differently
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Member</DialogTitle>
      <DialogContent dividers>
        {/* Simplified Form for brevity */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="LAB_MEMBER">Lab Member</MenuItem>
                <MenuItem value="LAB_ADMIN">Lab Admin</MenuItem>
                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MembersManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [bulkActionMenu, setBulkActionMenu] = useState<null | HTMLElement>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [previewMember, setPreviewMember] = useState<User | null>(null);
  const [editMember, setEditMember] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const queryClient = useQueryClient();

  // Fetch Users
  const { data: members = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users?limit=1000');
      return (response.data.data?.content || response.data?.content || []) as User[];
    }
  });

  // Bulk Action Mutation (Example for Deactivate)
  const bulkActionMutation = useMutation({
    mutationFn: async ({ ids, action }: { ids: string[], action: string }) => {
      // API doesn't support bulk action directly, so loop (not ideal but functional for now)
      // Or implement a bulk endpoint in backend.
      // For now, let's just simulate or do one by one.
      const promises = ids.map(id => {
        if (action === 'Deactivated') return api.patch(`/users/${id}/deactivate`);
        if (action === 'Activated') return api.patch(`/users/${id}/activate`);
        return Promise.resolve();
      });
      await Promise.all(promises);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({ open: true, message: `${variables.ids.length} members ${variables.action.toLowerCase()} successfully`, severity: 'success' });
      setSelectedMembers([]);
      setBulkActionMenu(null);
    }
  });

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      // Date filter logic can be added here
      return matchesStatus;
    });
  }, [members, statusFilter, dateFilter]);

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter(m => m.status === 'ACTIVE').length,
    inactive: members.filter(m => m.status === 'INACTIVE').length,
    suspended: members.filter(m => m.status === 'SUSPENDED').length, // Assuming SUSPENDED exists in backend enum?
    // Backend enum is ACTIVE, INACTIVE. Suspended might not exist.
  }), [members]);

  const handleBulkAction = (action: string) => {
    bulkActionMutation.mutate({ ids: selectedMembers, action });
  };

  const handleViewMember = (member: User) => {
    setPreviewMember(member);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{params.row.name?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{params.row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{params.row.email}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params: any) => (
        <Chip
          label={params.value?.replace('_', ' ')}
          size="small"
          color={params.value === 'LAB_ADMIN' ? 'secondary' : params.value === 'SUPER_ADMIN' ? 'error' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'ACTIVE' ? 'success' : 'default'} // 'default' for INACTIVE
        />
      ),
    },
    {
      field: 'joinDate',
      headerName: 'Joined',
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params: any) => (
        <IconButton onClick={(e) => { e.stopPropagation(); handleViewMember(params.row); }}>
          <ViewIcon />
        </IconButton>
      )
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage lab members, roles, and access permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
          >
            Import
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOnboardingOpen(true)}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={stats.total}
            icon={<PersonIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active"
            value={stats.active}
            subtitle={`${stats.total ? Math.round(stats.active / stats.total * 100) : 0}% of total`}
            icon={<ActiveIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inactive"
            value={stats.inactive}
            icon={<InactiveIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>

            {selectedMembers.length > 0 && (
              <>
                <Divider orientation="vertical" flexItem />
                <Chip
                  label={`${selectedMembers.length} selected`}
                  onDelete={() => setSelectedMembers([])}
                  color="primary"
                />
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={(e) => setBulkActionMenu(e.currentTarget)}
                >
                  Bulk Actions
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Bulk Action Menu */}
      <Menu
        anchorEl={bulkActionMenu}
        open={Boolean(bulkActionMenu)}
        onClose={() => setBulkActionMenu(null)}
      >
        <MenuItem onClick={() => handleBulkAction('Activated')}>
          <ListItemIcon><ActiveIcon color="success" fontSize="small" /></ListItemIcon>
          <ListItemText>Activate Selected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('Deactivated')}>
          <ListItemIcon><InactiveIcon color="warning" fontSize="small" /></ListItemIcon>
          <ListItemText>Deactivate Selected</ListItemText>
        </MenuItem>
      </Menu>

      {/* Members Table */}
      <DataTable
        columns={columns}
        data={filteredMembers}
        loading={isLoading}
        title="All Members"
        subtitle={`${filteredMembers.length} members found`}
        searchable={true}
        searchPlaceholder="Search by name, email..."
        pagination={true}
        defaultRowsPerPage={10}
        getRowId={(row) => row.id}
        checkboxSelection
        onSelectionModelChange={(selection) => setSelectedMembers(selection as string[])}
      />

      <OnboardingWizard open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />

      {/* Preview Dialog */}
      <Dialog open={!!previewMember} onClose={() => setPreviewMember(null)}>
        <DialogTitle>Member Details</DialogTitle>
        <DialogContent>
          {previewMember && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">{previewMember.name}</Typography>
              <Typography color="textSecondary">{previewMember.email}</Typography>
              <Typography sx={{ mt: 2 }}>Role: {previewMember.role}</Typography>
              <Typography>Status: {previewMember.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewMember(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MembersManagement;
