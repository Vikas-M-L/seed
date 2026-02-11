import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { exportToCSV } from '@/utils/exportUtils';

interface AuditLog {
  id: number;
  timestamp: string;
  userId: number;
  userName: string;
  userRole: string;
  action: 'EDIT' | 'CREATE' | 'DELETE' | 'APPROVE' | 'REJECT';
  entityType: 'ATTENDANCE' | 'SALARY' | 'LEAVE' | 'USER' | 'LAB' | 'ANNOUNCEMENT';
  entityId: number;
  entityName: string;
  previousValue?: string;
  newValue?: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
}

// Mock audit logs data
const generateMockAuditLogs = (): AuditLog[] => {
  const actions: AuditLog['action'][] = ['EDIT', 'CREATE', 'DELETE', 'APPROVE', 'REJECT'];
  const entityTypes: AuditLog['entityType'][] = ['ATTENDANCE', 'SALARY', 'LEAVE', 'USER', 'LAB', 'ANNOUNCEMENT'];
  const statuses: AuditLog['status'][] = ['SUCCESS', 'FAILED'];
  const userNames = ['Admin User', 'John Doe', 'Jane Smith', 'Ravi Kumar', 'Sarah Johnson'];
  const userRoles = ['LAB_ADMIN', 'SUPER_ADMIN'];

  const logs: AuditLog[] = [];
  for (let i = 1; i <= 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    
    logs.push({
      id: i,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
      userId: Math.floor(Math.random() * 10) + 1,
      userName: userNames[Math.floor(Math.random() * userNames.length)],
      userRole: userRoles[Math.floor(Math.random() * userRoles.length)],
      action,
      entityType,
      entityId: Math.floor(Math.random() * 100) + 1,
      entityName: `${entityType} #${Math.floor(Math.random() * 100) + 1}`,
      previousValue: action === 'EDIT' ? 'Previous Value' : undefined,
      newValue: action === 'EDIT' ? 'New Value' : undefined,
      details: `${action} performed on ${entityType}`,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const AuditLogs: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [filterEntity, setFilterEntity] = useState<string>('ALL');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const auditLogs = useMemo(() => generateMockAuditLogs(), []);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);
      const matchesAction = filterAction === 'ALL' || log.action === filterAction;
      const matchesEntity = filterEntity === 'ALL' || log.entityType === filterEntity;
      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [auditLogs, searchTerm, filterAction, filterEntity]);

  const paginatedLogs = filteredLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const handleDownloadLogs = () => {
    const data = filteredLogs.map(log => ({
      'Timestamp': new Date(log.timestamp).toLocaleString(),
      'User': log.userName,
      'Role': log.userRole,
      'Action': log.action,
      'Entity Type': log.entityType,
      'Entity': log.entityName,
      'Details': log.details,
      'IP Address': log.ipAddress,
      'Status': log.status,
    }));
    exportToCSV(data, `audit_logs_${new Date().toISOString().split('T')[0]}`);
  };

  const getActionColor = (action: AuditLog['action']) => {
    const colors: Record<AuditLog['action'], any> = {
      EDIT: 'info',
      CREATE: 'success',
      DELETE: 'error',
      APPROVE: 'success',
      REJECT: 'warning',
    };
    return colors[action];
  };

  const getStatusColor = (status: AuditLog['status']) => {
    return status === 'SUCCESS' ? 'success' : 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <HistoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Audit Logs
          </Typography>
          <Typography color="text.secondary">
            Track all system activities and changes across labs
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Total Logs
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {auditLogs.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Successful
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
              {auditLogs.filter(l => l.status === 'SUCCESS').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Failed
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
              {auditLogs.filter(l => l.status === 'FAILED').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              Last 24H
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
              {auditLogs.filter(l => {
                const logDate = new Date(l.timestamp);
                const dayAgo = new Date(Date.now() - 86400000);
                return logDate > dayAgo;
              }).length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<FilterIcon />}
          title="Filters"
          action={
            <Tooltip title="Download filtered logs">
              <IconButton onClick={handleDownloadLogs} size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search by user, entity, or IP..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Action</InputLabel>
                <Select
                  value={filterAction}
                  label="Action"
                  onChange={(e) => {
                    setFilterAction(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="ALL">All Actions</MenuItem>
                  <MenuItem value="CREATE">Create</MenuItem>
                  <MenuItem value="EDIT">Edit</MenuItem>
                  <MenuItem value="DELETE">Delete</MenuItem>
                  <MenuItem value="APPROVE">Approve</MenuItem>
                  <MenuItem value="REJECT">Reject</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={filterEntity}
                  label="Entity Type"
                  onChange={(e) => {
                    setFilterEntity(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value="ATTENDANCE">Attendance</MenuItem>
                  <MenuItem value="SALARY">Salary</MenuItem>
                  <MenuItem value="LEAVE">Leave</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="LAB">Lab</MenuItem>
                  <MenuItem value="ANNOUNCEMENT">Announcement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Timestamp</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Action</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Entity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>IP Address</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLogs.map(log => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {log.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.userRole}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={log.action} color={getActionColor(log.action)} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{log.entityType}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {log.entityName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {log.ipAddress}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    color={getStatusColor(log.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(log)}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Audit Log Details</DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {selectedLog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  TIMESTAMP
                </Typography>
                <Typography variant="body2">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  USER
                </Typography>
                <Typography variant="body2">
                  {selectedLog.userName} ({selectedLog.userRole})
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ACTION
                </Typography>
                <Chip label={selectedLog.action} color={getActionColor(selectedLog.action)} size="small" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ENTITY
                </Typography>
                <Typography variant="body2">
                  {selectedLog.entityType}: {selectedLog.entityName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  DETAILS
                </Typography>
                <Typography variant="body2">{selectedLog.details}</Typography>
              </Box>
              {selectedLog.previousValue && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    PREVIOUS VALUE
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                    {selectedLog.previousValue}
                  </Typography>
                </Box>
              )}
              {selectedLog.newValue && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    NEW VALUE
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                    {selectedLog.newValue}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  IP ADDRESS
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {selectedLog.ipAddress}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  STATUS
                </Typography>
                <Chip label={selectedLog.status} color={getStatusColor(selectedLog.status)} />
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AuditLogs;
