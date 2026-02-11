import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataTable, Column } from '@/components';
import { LeaveApplication, LeaveApplicationStatus } from '@/types';
import { mockLeaveApplications } from '@/services/mockData';

const LeaveManagement: React.FC = () => {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(
    mockLeaveApplications
  );
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
  }>({ open: false, action: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isLoading = false;

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

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleApprove = () => {
    if (selectedLeave) {
      const updatedLeaves = leaveApplications.map((leave) =>
        leave.id === selectedLeave.id
          ? {
              ...leave,
              status: 'APPROVED' as LeaveApplicationStatus,
              approvedBy: 3,
              approvedByName: 'Admin User',
              approvalDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : leave
      );
      setLeaveApplications(updatedLeaves);
      setActionDialog({ open: false, action: null });
      setSelectedLeave(null);
      setSuccessMessage(`Leave application approved for ${selectedLeave.labMemberName}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleReject = () => {
    if (selectedLeave && rejectionReason.trim()) {
      const updatedLeaves = leaveApplications.map((leave) =>
        leave.id === selectedLeave.id
          ? {
              ...leave,
              status: 'REJECTED' as LeaveApplicationStatus,
              rejectionReason,
              approvedBy: 3,
              approvedByName: 'Admin User',
              approvalDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : leave
      );
      setLeaveApplications(updatedLeaves);
      setActionDialog({ open: false, action: null });
      setSelectedLeave(null);
      setRejectionReason('');
      setSuccessMessage(`Leave application rejected for ${selectedLeave.labMemberName}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const openApproveDialog = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setActionDialog({ open: true, action: 'approve' });
  };

  const openRejectDialog = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setActionDialog({ open: true, action: 'reject' });
  };

  const closeDialog = () => {
    setActionDialog({ open: false, action: null });
    setSelectedLeave(null);
    setRejectionReason('');
  };

  const columns: Column<LeaveApplication>[] = [
    {
      id: 'labMemberName',
      label: 'Member',
      format: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.labMemberName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.labMemberEmail}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'labName',
      label: 'Lab',
      format: (value) => (value as string),
    },
    {
      id: 'leaveType',
      label: 'Type',
      align: 'center',
      format: (value) => (
        <Chip
          label={value as string}
          size="small"
          color={getLeaveTypeColor(value as string)}
          variant="outlined"
        />
      ),
    },
    {
      id: 'startDate',
      label: 'Duration',
      format: (_, row) => (
        <Typography variant="body2">
          {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
          <br />
          <span style={{ fontSize: '0.8em', color: '#999' }}>
            ({row.numberOfDays} days)
          </span>
        </Typography>
      ),
    },
    {
      id: 'reason',
      label: 'Reason',
      format: (value) => (
        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value as string}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      format: (value) => (
        <Chip
          label={value as string}
          size="small"
          color={getStatusColor(value as LeaveApplicationStatus)}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      sortable: false,
      format: (_, row) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => setSelectedLeave(row)}
              disabled={row.status !== 'PENDING'}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.status === 'PENDING' && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => openApproveDialog(row)}
                >
                  <ApproveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => openRejectDialog(row)}
                >
                  <RejectIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  const pendingCount = leaveApplications.filter((l) => l.status === 'PENDING').length;
  const approvedCount = leaveApplications.filter((l) => l.status === 'APPROVED').length;
  const rejectedCount = leaveApplications.filter((l) => l.status === 'REJECTED').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Leave Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and approve/reject leave applications from lab members
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'warning.light',
            color: 'warning.dark',
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Pending
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {pendingCount}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'success.light',
            color: 'success.dark',
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Approved
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {approvedCount}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'error.light',
            color: 'error.dark',
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Rejected
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {rejectedCount}
          </Typography>
        </Box>
      </Box>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={leaveApplications}
        loading={isLoading}
      />

      {/* Approve Dialog */}
      <Dialog open={actionDialog.open && actionDialog.action === 'approve'} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Leave Application</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedLeave && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2">
                <strong>Member:</strong> {selectedLeave.labMemberName}
              </Typography>
              <Typography variant="body2">
                <strong>Lab:</strong> {selectedLeave.labName}
              </Typography>
              <Typography variant="body2">
                <strong>Leave Type:</strong> {selectedLeave.leaveType}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()} to{' '}
                {new Date(selectedLeave.endDate).toLocaleDateString()} ({selectedLeave.numberOfDays} days)
              </Typography>
              <Typography variant="body2">
                <strong>Reason:</strong> {selectedLeave.reason}
              </Typography>
              <Alert severity="info" variant="outlined">
                Are you sure you want to approve this leave application?
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleApprove} variant="contained" color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionDialog.open && actionDialog.action === 'reject'} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Leave Application</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedLeave && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2">
                <strong>Member:</strong> {selectedLeave.labMemberName}
              </Typography>
              <Typography variant="body2">
                <strong>Lab:</strong> {selectedLeave.labName}
              </Typography>
              <Typography variant="body2">
                <strong>Leave Type:</strong> {selectedLeave.leaveType}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()} to{' '}
                {new Date(selectedLeave.endDate).toLocaleDateString()} ({selectedLeave.numberOfDays} days)
              </Typography>
              <Typography variant="body2">
                <strong>Reason:</strong> {selectedLeave.reason}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Please provide a reason for rejection (required)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                size="small"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={selectedLeave !== null && actionDialog.action === null} maxWidth="sm" fullWidth>
        <DialogTitle>Leave Application Details</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedLeave && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  MEMBER
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedLeave.labMemberName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedLeave.labMemberEmail}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  LAB
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedLeave.labName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  LEAVE TYPE
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedLeave.leaveType}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  DURATION
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(selectedLeave.startDate).toLocaleDateString()} to{' '}
                  {new Date(selectedLeave.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="caption">({selectedLeave.numberOfDays} days)</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  REASON
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedLeave.reason}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  STATUS
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedLeave.status}
                    size="small"
                    color={getStatusColor(selectedLeave.status)}
                  />
                </Box>
              </Box>
              {selectedLeave.status !== 'PENDING' && selectedLeave.approvalDate && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    APPROVAL DATE
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(selectedLeave.approvalDate).toLocaleString()}
                  </Typography>
                  <Typography variant="caption">Approved by: {selectedLeave.approvedByName}</Typography>
                </Box>
              )}
              {selectedLeave.status === 'REJECTED' && selectedLeave.rejectionReason && (
                <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    REJECTION REASON
                  </Typography>
                  <Typography variant="body2">{selectedLeave.rejectionReason}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedLeave(null)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveManagement;
