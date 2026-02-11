import React, { useState } from 'react';
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
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { mockOvertimeRequests, mockWorkHours } from '@/services/mockData';
import { OvertimeRequest } from '@/types';

const OvertimeAndWorkHours: React.FC = () => {
  const theme = useTheme();
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(mockOvertimeRequests);
  const [workHours] = useState(mockWorkHours);
  const [openOvertimeDialog, setOpenOvertimeDialog] = useState(false);

  const [overtimeForm, setOvertimeForm] = useState({
    labMemberId: '',
    date: '',
    overtimeHours: '',
    reason: '',
  });

  const handleAddOvertime = () => {
    setOvertimeForm({
      labMemberId: '',
      date: '',
      overtimeHours: '',
      reason: '',
    });
    setOpenOvertimeDialog(true);
  };

  const handleSaveOvertime = () => {
    if (!overtimeForm.labMemberId || !overtimeForm.date || !overtimeForm.overtimeHours) {
      alert('Please fill in all required fields');
      return;
    }
    setOpenOvertimeDialog(false);
    alert('Overtime request saved successfully!');
  };

  const handleApproveOvertime = (id: number) => {
    setOvertimeRequests(
      overtimeRequests.map((req) =>
        req.id === id ? { ...req, status: 'APPROVED' as const, approvedBy: 1, approvedByName: 'Admin', approvalDate: new Date().toISOString().split('T')[0] } : req
      )
    );
    alert('Overtime approved!');
  };

  const handleRejectOvertime = (id: number) => {
    setOvertimeRequests(
      overtimeRequests.map((req) =>
        req.id === id ? { ...req, status: 'REJECTED' as const, approvedBy: 1, approvedByName: 'Admin', approvalDate: new Date().toISOString().split('T')[0] } : req
      )
    );
    alert('Overtime rejected!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateTotalOvertimeCost = (hours: number, dailyRate: number = 500) => {
    return hours * dailyRate;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AccessTimeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4">Overtime & Work Hours Management</Typography>
              <Typography color="text.secondary">Manage overtime requests and track work hours</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.success.main, 0.1), border: `1px solid ${theme.palette.success.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Overtime Approved
              </Typography>
              <Typography variant="h4">
                {overtimeRequests.filter((r) => r.status === 'APPROVED').reduce((sum, r) => sum + r.overtimeHours, 0)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${theme.palette.warning.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Overtime Requests
              </Typography>
              <Typography variant="h4">
                {overtimeRequests.filter((r) => r.status === 'PENDING').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.info.main, 0.1), border: `1px solid ${theme.palette.info.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Extra Hours
              </Typography>
              <Typography variant="h4">
                {(workHours.reduce((sum, w) => sum + w.extraHours, 0) / workHours.length).toFixed(1)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.primary.main, 0.1), border: `1px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Overtime Cost (Estimated)
              </Typography>
              <Typography variant="h4">
                ₹{calculateTotalOvertimeCost(
                  overtimeRequests.filter((r) => r.status === 'APPROVED').reduce((sum, r) => sum + r.overtimeHours, 0)
                ).toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Overtime Requests */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardHeader
              title="Overtime Requests"
              action={
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOvertime} size="small">
                  New Request
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%' }}>
                {overtimeRequests.map((request, index) => (
                  <div key={request.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                      }}
                    >
                      <ListItemIcon>
                        <AccessTimeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontWeight: 600 }}>{request.labMemberName}</Typography>
                            <Chip
                              label={request.status}
                              size="small"
                              color={getStatusColor(request.status) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Date: {new Date(request.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Hours: {request.overtimeHours}h • Reason: {request.reason}
                            </Typography>
                          </Box>
                        }
                      />
                      {request.status === 'PENDING' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApproveOvertime(request.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRejectOvertime(request.id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      )}
                      {request.status === 'APPROVED' && (
                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                      )}
                    </ListItem>
                    {index < overtimeRequests.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Hours Summary */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardHeader title="Work Hours Summary" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        OT
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Extra
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workHours.map((record) => (
                      <TableRow key={record.id} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{record.labMemberName}</TableCell>
                        <TableCell align="right">{record.totalWorkHours}h</TableCell>
                        <TableCell align="right">
                          <Chip label={`${record.overtimeHours}h`} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: record.extraHours > 0 ? 'success.main' : 'text.secondary',
                            }}
                          >
                            {record.extraHours}h
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Overtime Dialog */}
      <Dialog open={openOvertimeDialog} onClose={() => setOpenOvertimeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Add Overtime Request</span>
            <IconButton onClick={() => setOpenOvertimeDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              select
              fullWidth
              label="Select Member"
              value={overtimeForm.labMemberId}
              onChange={(e) => setOvertimeForm({ ...overtimeForm, labMemberId: e.target.value })}
            >
              <option value="">Select a member</option>
              <option value="1">John Doe</option>
              <option value="2">Alice Johnson</option>
              <option value="3">Bob Wilson</option>
            </TextField>
            <TextField
              type="date"
              label="Date"
              value={overtimeForm.date}
              onChange={(e) => setOvertimeForm({ ...overtimeForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="number"
              label="Overtime Hours"
              value={overtimeForm.overtimeHours}
              onChange={(e) => setOvertimeForm({ ...overtimeForm, overtimeHours: e.target.value })}
              inputProps={{ step: 0.5, min: 0 }}
            />
            <TextField
              fullWidth
              label="Reason"
              value={overtimeForm.reason}
              onChange={(e) => setOvertimeForm({ ...overtimeForm, reason: e.target.value })}
              multiline
              rows={2}
              placeholder="Why is overtime needed?"
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenOvertimeDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveOvertime} variant="contained">
            Create Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OvertimeAndWorkHours;
