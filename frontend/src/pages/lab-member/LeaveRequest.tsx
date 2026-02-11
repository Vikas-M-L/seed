import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { LeaveApplication, LeaveApplicationStatus, LeaveType } from '@/types';
import { mockLeaveApplications } from '@/services/mockData';

interface LeaveFormData {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveRequest: React.FC = () => {
  const { user } = useAuthStore();
  const [myApplications, setMyApplications] = useState<LeaveApplication[]>(
    mockLeaveApplications.filter((app) => app.labMemberId === user?.id)
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const leaveTypes: LeaveType[] = ['CASUAL', 'MEDICAL', 'EARNED', 'UNPAID', 'MATERNITY', 'PATERNITY'];

  const getStatusColor = (status: LeaveApplicationStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info'> = {
      CASUAL: 'primary',
      MEDICAL: 'error',
      EARNED: 'info',
      UNPAID: 'warning',
      MATERNITY: 'info',
      PATERNITY: 'info',
    };
    return colors[type] || 'default';
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleOpenDialog = (application?: LeaveApplication) => {
    if (application) {
      setEditingId(application.id);
      setFormData({
        leaveType: application.leaveType,
        startDate: application.startDate,
        endDate: application.endDate,
        reason: application.reason,
      });
    } else {
      setEditingId(null);
      setFormData({
        leaveType: 'CASUAL',
        startDate: '',
        endDate: '',
        reason: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setFormData({
      leaveType: 'CASUAL',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const handleInputChange = (field: keyof LeaveFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date');
      return;
    }

    const numberOfDays = calculateDays(formData.startDate, formData.endDate);

    if (editingId) {
      // Update existing application
      const updatedApps = myApplications.map((app) =>
        app.id === editingId
          ? {
              ...app,
              leaveType: formData.leaveType,
              startDate: formData.startDate,
              endDate: formData.endDate,
              numberOfDays,
              reason: formData.reason,
              updatedAt: new Date().toISOString(),
            }
          : app
      );
      setMyApplications(updatedApps);
      setSuccessMessage('Leave application updated successfully');
    } else {
      // Create new application
      const newApplication: LeaveApplication = {
        id: Math.max(...myApplications.map((a) => a.id), 0) + 1,
        labMemberId: user?.id || 0,
        labMemberName: user?.name || '',
        labMemberEmail: user?.email || '',
        labId: user?.labId || 0,
        labName: user?.labName || '',
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfDays,
        reason: formData.reason,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMyApplications([...myApplications, newApplication]);
      setSuccessMessage('Leave application submitted successfully');
    }

    setTimeout(() => setSuccessMessage(''), 3000);
    handleCloseDialog();
  };

  const handleCancel = (applicationId: number) => {
    const app = myApplications.find((a) => a.id === applicationId);
    if (app && app.status === 'PENDING') {
      const updated = myApplications.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'CANCELLED' as LeaveApplicationStatus,
              updatedAt: new Date().toISOString(),
            }
          : a
      );
      setMyApplications(updated);
      setSuccessMessage('Leave application cancelled');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDelete = (applicationId: number) => {
    const app = myApplications.find((a) => a.id === applicationId);
    if (app && app.status === 'PENDING') {
      setMyApplications(myApplications.filter((a) => a.id !== applicationId));
      setSuccessMessage('Leave application deleted');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const pendingCount = myApplications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = myApplications.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = myApplications.filter((a) => a.status === 'REJECTED').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Leave Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Apply for leave and track your applications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh">
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Application
          </Button>
        </Box>
      </Box>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        <Card sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Pending
          </Typography>
          <Typography variant="h4" fontWeight={700} color="warning.dark">
            {pendingCount}
          </Typography>
        </Card>
        <Card sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Approved
          </Typography>
          <Typography variant="h4" fontWeight={700} color="success.dark">
            {approvedCount}
          </Typography>
        </Card>
        <Card sx={{ p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Rejected
          </Typography>
          <Typography variant="h4" fontWeight={700} color="error.dark">
            {rejectedCount}
          </Typography>
        </Card>
      </Box>

      {/* Applications Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Days</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No leave applications found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              myApplications.map((application) => (
                <TableRow key={application.id} hover>
                  <TableCell>
                    <Chip
                      label={application.leaveType}
                      size="small"
                      color={getLeaveTypeColor(application.leaveType)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(application.startDate).toLocaleDateString()} -{' '}
                      {new Date(application.endDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {application.numberOfDays}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {application.reason}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={application.status}
                      size="small"
                      color={getStatusColor(application.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {application.status === 'PENDING' && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(application)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleCancel(application.id)}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(application.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Leave Application Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Leave Application' : 'Apply for Leave'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Leave Type */}
          <FormControl fullWidth>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={formData.leaveType}
              label="Leave Type"
              onChange={(e) => handleInputChange('leaveType', e.target.value)}
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Start Date */}
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />

          {/* End Date */}
          <TextField
            fullWidth
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
          />

          {/* Days Display */}
          {formData.startDate && formData.endDate && (
            <Alert severity="info">
              Total Days: <strong>{calculateDays(formData.startDate, formData.endDate)}</strong>
            </Alert>
          )}

          {/* Reason */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Leave"
            placeholder="Please provide the reason for your leave request"
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.startDate || !formData.endDate || !formData.reason.trim()}
          >
            {editingId ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequest;
