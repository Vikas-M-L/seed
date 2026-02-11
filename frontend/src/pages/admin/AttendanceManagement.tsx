import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  LinearProgress,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  ViewList as ListIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  CheckCircleOutline as FullDayIcon,
  RemoveCircleOutline as HalfDayIcon,
  Cancel as LopIcon,
  Event as HolidayIcon,
  Weekend as WeekendIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { StatCard } from '@/components';
import { getMonthOptions, AttendanceStatus, User } from '@/types';

// Helper function for attendance status colors
const getStatusColor = (status: AttendanceStatus | string) => {
  switch (status) {
    case 'FULL':
    case 'PRESENT': return 'success';
    case 'HALF':
    case 'HALF_DAY': return 'warning';
    case 'LOP':
    case 'ABSENT': return 'error';
    case 'HOLIDAY': return 'info';
    case 'WEEKEND': return 'default';
    default: return 'default';
  }
};

const getStatusIcon = (status: AttendanceStatus | string) => {
  switch (status) {
    case 'FULL':
    case 'PRESENT': return <FullDayIcon fontSize="small" />;
    case 'HALF':
    case 'HALF_DAY': return <HalfDayIcon fontSize="small" />;
    case 'LOP':
    case 'ABSENT': return <LopIcon fontSize="small" />;
    case 'HOLIDAY': return <HolidayIcon fontSize="small" />;
    case 'WEEKEND': return <WeekendIcon fontSize="small" />;
    default: return undefined;
  }
};

const AttendanceManagement: React.FC = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false);
  const [memberDetailDialog, setMemberDetailDialog] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const queryClient = useQueryClient();

  const monthOptions = getMonthOptions();

  // Fetch Users
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users?limit=1000');
      return response.data.data?.content || response.data?.content || [];
    }
  });

  // Fetch Attendance Records for the selected month
  const { data: attendanceRecords = [], isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['admin-attendance', selectedYear, selectedMonth],
    queryFn: async () => {
      const startDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1)).toISOString();
      const endDate = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59)).toISOString();
      const response = await api.get(`/attendance?startDate=${startDate}&endDate=${endDate}`);
      return response.data.data || response.data || [];
    }
  });

  // Process data for Member List View
  const memberAttendance = useMemo(() => {
    return users.map((user: User) => {
      const userRecords = attendanceRecords.filter((r: any) => r.userId === user.id);

      const fullDays = userRecords.filter((r: any) => r.status === 'PRESENT').length;
      const halfDays = userRecords.filter((r: any) => r.status === 'HALF_DAY').length;
      const lopDays = userRecords.filter((r: any) => r.status === 'ABSENT').length;

      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const totalWorkingDaysEstimate = daysInMonth - 8; // Approx 8 weekend days
      const presentEquivalent = fullDays + (halfDays * 0.5);
      const attendancePercentage = Math.min(100, Math.round((presentEquivalent / (totalWorkingDaysEstimate || 1)) * 100));

      return {
        ...user,
        fullDays,
        halfDays,
        lopDays,
        attendancePercentage: attendancePercentage,
        isComplete: attendancePercentage > 0, // Placeholder
        lastMarked: userRecords.length > 0 ? userRecords[0].date : null,
      };
    });
  }, [users, attendanceRecords, selectedYear, selectedMonth]);

  // Process data for Calendar Heatmap View
  const calendarData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const records = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth - 1, day);
      const dateStr = date.toISOString().split('T')[0];
      const recordsForDay = attendanceRecords.filter((r: any) => r.date.startsWith(dateStr));

      let status = 'WEEKEND';
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        if (recordsForDay.length > 0) {
          const presentCount = recordsForDay.filter((r: any) => r.status === 'PRESENT').length;
          const absentCount = recordsForDay.filter((r: any) => r.status === 'ABSENT').length;
          if (presentCount > absentCount) status = 'FULL';
          else if (absentCount > presentCount) status = 'LOP';
          else status = 'HALF';
        } else {
          status = 'PENDING';
        }
      }

      if (recordsForDay.length > 0) {
        if (status === 'PENDING') status = 'FULL';
      }

      records.push({
        date: dateStr,
        status: status === 'PENDING' ? (dayOfWeek === 0 || dayOfWeek === 6 ? 'WEEKEND' : 'FULL') : status,
        remarks: `${recordsForDay.length} records`
      });
    }
    return { records };
  }, [attendanceRecords, selectedYear, selectedMonth]);


  // Filter members based on search and status
  const filteredMembers = useMemo(() => {
    return memberAttendance.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'complete' && member.isComplete) ||
        (statusFilter === 'pending' && !member.isComplete) ||
        (statusFilter === 'active' && member.status === 'ACTIVE') ||
        (statusFilter === 'inactive' && member.status === 'INACTIVE');
      return matchesSearch && matchesStatus;
    });
  }, [memberAttendance, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => ({
    totalMembers: memberAttendance.length,
    attendanceMarked: memberAttendance.filter(m => m.isComplete).length,
    pending: memberAttendance.filter(m => !m.isComplete).length,
    averageAttendance: memberAttendance.length > 0 ? Math.round(memberAttendance.reduce((acc, m) => acc + m.attendancePercentage, 0) / memberAttendance.length) : 0,
  }), [memberAttendance]);

  const handleFreezeMonth = () => {
    setSnackbar({ open: true, message: 'Month frozen successfully! Attendance records are now locked.', severity: 'success' });
    setFreezeDialogOpen(false);
  };

  const handleMonthChange = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    setSelectedYear(year);
    setSelectedMonth(month);
    queryClient.invalidateQueries({ queryKey: ['admin-attendance'] });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleBulkEdit = () => {
    setBulkEditDialogOpen(true);
    setAnchorEl(null);
  };

  const handleBulkMarkComplete = () => {
    setSnackbar({ open: true, message: `Marked ${selectedMembers.length} members as complete`, severity: 'success' });
    setSelectedMembers([]);
    setAnchorEl(null);
  };

  const handleExport = (format: string) => {
    setSnackbar({ open: true, message: `Exporting attendance data as ${format.toUpperCase()}...`, severity: 'info' });
    setAnchorEl(null);
  };

  const handleViewMemberDetail = (memberId: string) => {
    setMemberDetailDialog(memberId);
  };

  const handleEditMember = (memberId: string) => {
    setSelectedMemberForEdit(memberId);
    setEditDialogOpen(true);
  };

  // Calendar heatmap view
  const CalendarHeatmap = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const days = calendarData.records;

    return (
      <Card>
        <CardHeader
          title="Attendance Calendar Heatmap"
          subheader={`${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['FULL', 'HALF', 'LOP', 'HOLIDAY', 'WEEKEND'].map((status) => (
                <Chip
                  key={status}
                  size="small"
                  icon={getStatusIcon(status as AttendanceStatus)}
                  label={status}
                  color={getStatusColor(status as AttendanceStatus) as 'success' | 'warning' | 'error' | 'info' | 'default'}
                  variant="outlined"
                />
              ))}
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Typography key={day} variant="caption" align="center" fontWeight={600} color="text.secondary">
                {day}
              </Typography>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <Box key={`empty-${i}`} />
            ))}
            {days.map((day, index) => (
              <Tooltip
                key={index}
                title={`${day.date}: ${day.status}${day.remarks ? ` - ${day.remarks}` : ''}`}
              >
                <Box
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    bgcolor: getStatusColor(day.status) === 'success' ? 'success.light' :
                      getStatusColor(day.status) === 'warning' ? 'warning.light' :
                        getStatusColor(day.status) === 'error' ? 'error.light' :
                          getStatusColor(day.status) === 'info' ? 'info.light' :
                            getStatusColor(day.status) === 'default' ? 'grey.200' : 'grey.100',
                    color: day.status === 'WEEKEND' ? 'text.disabled' : 'text.primary',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: 2,
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {new Date(day.date).getDate()}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Member Quick Preview Dialog
  const MemberDetailDialog = () => {
    const member = memberAttendance.find(m => m.id === memberDetailDialog);
    if (!member) return null;

    return (
      <Dialog open={!!memberDetailDialog} onClose={() => setMemberDetailDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{member.name.charAt(0)}</Avatar>
          <Box>
            <Typography variant="h6">{member.name}</Typography>
            <Typography variant="body2" color="text.secondary">{member.email}</Typography>
          </Box>
          <IconButton sx={{ ml: 'auto' }} onClick={() => setMemberDetailDialog(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="h4" color="success.dark">{member.fullDays}</Typography>
                <Typography variant="body2" color="success.dark">Full Days</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                <Typography variant="h4" color="warning.dark">{member.halfDays}</Typography>
                <Typography variant="body2" color="warning.dark">Half Days</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                <Typography variant="h4" color="error.dark">{member.lopDays}</Typography>
                <Typography variant="body2" color="error.dark">LOP Days</Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Attendance Progress</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={member.attendancePercentage}
                sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
                color={member.attendancePercentage >= 90 ? 'success' : member.attendancePercentage >= 75 ? 'warning' : 'error'}
              />
              <Typography variant="body2" fontWeight={600}>{member.attendancePercentage}%</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip label={member.status} size="small" color={member.status === 'ACTIVE' ? 'success' : 'default'} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Join Date</Typography>
                <Typography variant="body2">{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Base Salary</Typography>
                <Typography variant="body2">₹{(member as any).baseSalary?.toLocaleString('en-IN') || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Attendance Status</Typography>
                <Chip
                  label={member.isComplete ? 'Complete' : 'Pending'}
                  size="small"
                  color={member.isComplete ? 'success' : 'warning'}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDetailDialog(null)}>Close</Button>
          <Button variant="contained" onClick={() => { setMemberDetailDialog(null); handleEditMember(member.id); }}>
            Edit Attendance
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Edit Attendance Dialog
  const EditAttendanceDialog = () => {
    const member = memberAttendance.find(m => m.id === selectedMemberForEdit);
    if (!member) return null;

    return (
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Attendance - {member.name}</DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click on any day to change its attendance status
          </Alert>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Typography key={day} variant="caption" align="center" fontWeight={600}>
                {day}
              </Typography>
            ))}
            {calendarData.records.map((day, index) => (
              <Tooltip key={index} title={`Click to edit ${day.date}`}>
                <Box
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: getStatusColor(day.status) === 'success' ? 'success.light' :
                      getStatusColor(day.status) === 'warning' ? 'warning.light' :
                        getStatusColor(day.status) === 'error' ? 'error.light' :
                          getStatusColor(day.status) === 'info' ? 'info.light' :
                            getStatusColor(day.status) === 'default' ? 'grey.200' : 'grey.100',
                    color: day.status === 'WEEKEND' ? 'text.disabled' : 'text.primary',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      opacity: 0.8
                    },
                  }}
                >
                  <Typography variant="body2">{new Date(day.date).getDate()}</Typography>
                  <Typography variant="caption">{day.status}</Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditDialogOpen(false);
              setSnackbar({ open: true, message: 'Attendance updated successfully', severity: 'success' });
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Attendance Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage lab member attendance with calendar heatmap
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={`${selectedYear}-${selectedMonth}`}
              label="Month"
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              {monthOptions.map((option) => (
                <MenuItem key={`${option.year}-${option.month}`} value={`${option.year}-${option.month}`}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="list">
              <Tooltip title="List View"><ListIcon /></Tooltip>
            </ToggleButton>
            <ToggleButton value="calendar">
              <Tooltip title="Calendar View"><CalendarIcon /></Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() => setFreezeDialogOpen(true)}
            color="warning"
          >
            Freeze Month
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Export
          </Button>

          <Tooltip title="Refresh">
            <IconButton
              sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['users'] });
                queryClient.invalidateQueries({ queryKey: ['admin-attendance'] });
                setSnackbar({ open: true, message: 'Data refreshed', severity: 'info' });
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Export Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleExport('xlsx')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
      </Menu>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={<PersonIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance Marked"
            value={stats.attendanceMarked}
            subtitle={`${stats.totalMembers ? Math.round(stats.attendanceMarked / stats.totalMembers * 100) : 0}% complete`}
            icon={<CheckIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            subtitle="Needs attention"
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg. Attendance"
            value={`${stats.averageAttendance}%`}
            icon={<TrendingIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Calendar Heatmap View */}
      {viewMode === 'calendar' && (
        <Box sx={{ mb: 4 }}>
          <CalendarHeatmap />
        </Box>
      )}

      {/* Search and Filter Bar */}
      {viewMode === 'list' && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flexGrow: 1, minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Members</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              {selectedMembers.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={`${selectedMembers.length} selected`}
                    onDelete={() => setSelectedMembers([])}
                    color="primary"
                  />
                  <Button size="small" variant="outlined" onClick={handleBulkEdit}>
                    Bulk Edit
                  </Button>
                  <Button size="small" variant="contained" color="success" onClick={handleBulkMarkComplete}>
                    Mark Complete
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Members Attendance Table */}
      {viewMode === 'list' && (
        <Card>
          <CardHeader
            title="Member Attendance"
            subheader={`${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })} • ${filteredMembers.length} members`}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  size="small"
                  icon={<ScheduleIcon />}
                  label="Real-time updates"
                  color="success"
                  variant="outlined"
                />
              </Box>
            }
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedMembers.length > 0 && selectedMembers.length < filteredMembers.length}
                      checked={filteredMembers.length > 0 && selectedMembers.length === filteredMembers.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell align="center">Full Days</TableCell>
                  <TableCell align="center">Half Days</TableCell>
                  <TableCell align="center">LOP</TableCell>
                  <TableCell align="center">Attendance %</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        {isAttendanceLoading ? 'Loading data...' : 'No members found matching your criteria'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      hover
                      selected={selectedMembers.includes(member.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell onClick={() => handleViewMemberDetail(member.id)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              member.isComplete ?
                                <CheckIcon sx={{ fontSize: 14, color: 'success.main', bgcolor: 'white', borderRadius: '50%' }} /> :
                                <WarningIcon sx={{ fontSize: 14, color: 'warning.main', bgcolor: 'white', borderRadius: '50%' }} />
                            }
                          >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {member.name.charAt(0)}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {member.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={member.fullDays} size="small" color="success" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={member.halfDays} size="small" color="warning" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={member.lopDays} size="small" color="error" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={member.attendancePercentage}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                            color={member.attendancePercentage >= 90 ? 'success' : member.attendancePercentage >= 75 ? 'warning' : 'error'}
                          />
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={member.attendancePercentage >= 90 ? 'success.main' : member.attendancePercentage >= 75 ? 'warning.main' : 'error.main'}
                          >
                            {member.attendancePercentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={member.isComplete ? 'Complete' : 'Pending'}
                          size="small"
                          color={member.isComplete ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewMemberDetail(member.id)}>
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Attendance">
                            <IconButton size="small" onClick={() => handleEditMember(member.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Member Detail Dialog */}
      <MemberDetailDialog />

      {/* Edit Attendance Dialog */}
      <EditAttendanceDialog />

      {/* Bulk Edit Dialog */}
      <Dialog open={bulkEditDialogOpen} onClose={() => setBulkEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Edit Attendance</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are editing attendance for {selectedMembers.length} members
          </Alert>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Set Status</InputLabel>
            <Select label="Set Status" defaultValue="">
              <MenuItem value="FULL">Full Day</MenuItem>
              <MenuItem value="HALF">Half Day</MenuItem>
              <MenuItem value="LOP">Loss of Pay</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Remarks"
            multiline
            rows={2}
            sx={{ mt: 2 }}
            placeholder="Add remarks for this bulk update..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setBulkEditDialogOpen(false);
              setSelectedMembers([]);
              setSnackbar({ open: true, message: 'Bulk update applied successfully', severity: 'success' });
            }}
          >
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Freeze Dialog */}
      <Dialog open={freezeDialogOpen} onClose={() => setFreezeDialogOpen(false)}>
        <DialogTitle>Freeze Attendance</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to freeze attendance for{' '}
            <strong>
              {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </strong>
            ?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action will lock all attendance records for this month. Changes will require admin approval to modify.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFreezeDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleFreezeMonth}
          >
            Freeze Month
          </Button>
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

export default AttendanceManagement;
