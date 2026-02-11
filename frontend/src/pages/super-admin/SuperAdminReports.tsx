import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  CalendarMonth as CalendarIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { exportToPDF, exportToCSV } from '@/utils/exportUtils';
import { mockLabMembers } from '@/services/mockData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SuperAdminReports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDownloadAttendanceReport = async (format: 'pdf' | 'csv') => {
    setIsGenerating(true);
    try {
      const data = mockLabMembers.map(member => ({
        'Member ID': member.id,
        'Name': member.name,
        'Lab': `Lab ${member.labId}`,
        'Present': Math.floor(Math.random() * 20) + 10,
        'Absent': Math.floor(Math.random() * 3),
        'Leave': Math.floor(Math.random() * 5),
        'Percentage': (Math.random() * 20 + 80).toFixed(2) + '%',
      }));

      if (format === 'pdf') {
        await exportToPDF(
          `Monthly Attendance Report - ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
          data,
          undefined,
          {
            'Total Members': data.length,
            'Month': new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
            'Average Attendance': (data.reduce((sum: number, d: any) => sum + parseFloat(d.Percentage), 0) / data.length).toFixed(2) + '%',
          }
        );
      } else {
        exportToCSV(data, `attendance_report_${selectedYear}_${selectedMonth}`);
      }

      setSnackbar({ open: true, message: `Attendance report downloaded as ${format.toUpperCase()}`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error generating report', severity: 'error' });
    }
    setIsGenerating(false);
  };

  const handleDownloadSalaryReport = async (format: 'pdf' | 'csv') => {
    setIsGenerating(true);
    try {
      const data = mockLabMembers.map(member => {
        const baseSalary = member.baseSalary || 50000;
        const deductions = Math.floor(baseSalary * 0.1);
        return {
          'Member ID': member.id,
          'Name': member.name,
          'Lab': `Lab ${member.labId}`,
          'Base Salary': `₹${baseSalary.toLocaleString('en-IN')}`,
          'Deductions': `₹${deductions.toLocaleString('en-IN')}`,
          'Net Salary': `₹${(baseSalary - deductions).toLocaleString('en-IN')}`,
        };
      });

      if (format === 'pdf') {
        await exportToPDF(
          `Salary Report - ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
          data,
          undefined,
          {
            'Total Members': data.length,
            'Total Payroll': `₹${(mockLabMembers.reduce((sum, m) => sum + (m.baseSalary || 50000), 0)).toLocaleString('en-IN')}`,
            'Month': new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
          }
        );
      } else {
        exportToCSV(data, `salary_report_${selectedYear}_${selectedMonth}`);
      }

      setSnackbar({ open: true, message: `Salary report downloaded as ${format.toUpperCase()}`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error generating report', severity: 'error' });
    }
    setIsGenerating(false);
  };

  const handleDownloadLabReport = async (format: 'pdf' | 'csv') => {
    setIsGenerating(true);
    try {
      // Group members by lab
      const labStats = new Map<number, any>();
      mockLabMembers.forEach(member => {
        if (!labStats.has(member.labId)) {
          labStats.set(member.labId, {
            'Lab ID': member.labId,
            'Lab Name': `Lab ${member.labId}`,
            'Total Members': 0,
            'Total Payroll': 0,
            'Average Attendance': 0,
          });
        }
        const lab = labStats.get(member.labId)!;
        lab['Total Members'] += 1;
        lab['Total Payroll'] += member.baseSalary || 50000;
      });

      const data = Array.from(labStats.values()).map(lab => ({
        ...lab,
        'Total Payroll': `₹${lab['Total Payroll'].toLocaleString('en-IN')}`,
        'Average Attendance': (Math.random() * 20 + 80).toFixed(2) + '%',
      }));

      if (format === 'pdf') {
        await exportToPDF(
          'Lab-wise Report',
          data,
          undefined,
          {
            'Total Labs': data.length,
            'Total Members': mockLabMembers.length,
            'Generated': new Date().toLocaleDateString(),
          }
        );
      } else {
        exportToCSV(data, `lab_report_${new Date().toISOString().split('T')[0]}`);
      }

      setSnackbar({ open: true, message: `Lab report downloaded as ${format.toUpperCase()}`, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error generating report', severity: 'error' });
    }
    setIsGenerating(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            System Reports
          </Typography>
          <Typography color="text.secondary">
            Generate and export comprehensive reports across all labs
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tab
            label="Attendance Reports"
            icon={<CalendarIcon />}
            iconPosition="start"
          />
          <Tab
            label="Salary Reports"
            icon={<MoneyIcon />}
            iconPosition="start"
          />
          <Tab
            label="Lab Reports"
            icon={<GroupIcon />}
            iconPosition="start"
          />
        </Tabs>

        {/* Attendance Reports Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Filters */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Month</InputLabel>
                      <Select
                        value={selectedMonth}
                        label="Month"
                        onChange={(e) => setSelectedMonth(e.target.value as number)}
                      >
                        {[...Array(12)].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Year</InputLabel>
                      <Select
                        value={selectedYear}
                        label="Year"
                        onChange={(e) => setSelectedYear(e.target.value as number)}
                      >
                        {[2024, 2025, 2026].map(year => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Report Cards */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<PdfIcon />}
                  title="PDF Report"
                  subheader="Download as PDF"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Generate attendance report in PDF format with charts and summaries
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadAttendanceReport('pdf')}
                    disabled={isGenerating}
                  >
                    Download PDF
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<ExcelIcon />}
                  title="Excel Report"
                  subheader="Download as Excel"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Export attendance data to Excel for further analysis
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadAttendanceReport('csv')}
                    disabled={isGenerating}
                  >
                    Download CSV
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<TrendingIcon />}
                  title="Analytics Summary"
                  subheader="Quick insights"
                />
                <CardContent>
                  <List disablePadding>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Total Members"
                        secondary={mockLabMembers.length}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Avg Attendance"
                        secondary="87.5%"
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="On-time Rate"
                        secondary="92.3%"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Salary Reports Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Filters */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Month</InputLabel>
                      <Select
                        value={selectedMonth}
                        label="Month"
                        onChange={(e) => setSelectedMonth(e.target.value as number)}
                      >
                        {[...Array(12)].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Year</InputLabel>
                      <Select
                        value={selectedYear}
                        label="Year"
                        onChange={(e) => setSelectedYear(e.target.value as number)}
                      >
                        {[2024, 2025, 2026].map(year => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Report Cards */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<PdfIcon />}
                  title="PDF Report"
                  subheader="Download as PDF"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Detailed payroll report with employee salaries and deductions
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadSalaryReport('pdf')}
                    disabled={isGenerating}
                  >
                    Download PDF
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<ExcelIcon />}
                  title="Excel Report"
                  subheader="Download as Excel"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Export salary data to Excel for payroll processing
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadSalaryReport('csv')}
                    disabled={isGenerating}
                  >
                    Download CSV
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<MoneyIcon />}
                  title="Payroll Summary"
                  subheader="Month Overview"
                />
                <CardContent>
                  <List disablePadding>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Total Payroll"
                        secondary="₹12,50,000"
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Total Deductions"
                        secondary="₹1,25,000"
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Net Payout"
                        secondary="₹11,25,000"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Lab Reports Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {/* Report Cards */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<PdfIcon />}
                  title="PDF Report"
                  subheader="Download as PDF"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Lab-wise summary with member count and payroll overview
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadLabReport('pdf')}
                    disabled={isGenerating}
                  >
                    Download PDF
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<ExcelIcon />}
                  title="Excel Report"
                  subheader="Download as Excel"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Export lab-wise data for analysis and comparison
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadLabReport('csv')}
                    disabled={isGenerating}
                  >
                    Download CSV
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  avatar={<GroupIcon />}
                  title="Lab Overview"
                  subheader="Across System"
                />
                <CardContent>
                  <List disablePadding>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Total Labs"
                        secondary="3"
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Total Members"
                        secondary={mockLabMembers.length}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Avg Lab Size"
                        secondary={Math.round(mockLabMembers.length / 3)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuperAdminReports;
