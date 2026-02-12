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
  TextField,
  Typography,
  Stack,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
// TODO: Backend API for deductions not yet implemented - using mock data
import { mockDeductions, mockPayrollSummary, mockSalarySlips } from '@/services/mockData';
import { exportToPDF, exportSalarySlipToPDF } from '@/utils/exportUtils';

// NOTE: This page uses mock data because the backend deductions API endpoints don't exist yet.
// The payroll API exists at /api/payroll but deductions management is not implemented.
// Once backend implements /api/payroll/deductions endpoints, update this to use real API calls.

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
      id={`payroll-tabpanel-${index}`}
      aria-labelledby={`payroll-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PayrollAndDeductions: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [deductions] = useState(mockDeductions);
  const [openDeductionDialog, setOpenDeductionDialog] = useState(false);

  const [deductionForm, setDeductionForm] = useState({
    name: '',
    type: 'OTHER',
    amount: '',
    percentage: '',
    isApplicableToAll: false,
    description: '',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddDeduction = () => {
    setDeductionForm({
      name: '',
      type: 'OTHER',
      amount: '',
      percentage: '',
      isApplicableToAll: false,
      description: '',
    });
    setOpenDeductionDialog(true);
  };

  const handleSaveDeduction = () => {
    if (!deductionForm.name) {
      alert('Please fill in the deduction name');
      return;
    }
    setOpenDeductionDialog(false);
    alert('Deduction saved successfully!');
  };

  const handleDownloadPayslips = async () => {
    const payslipData = mockSalarySlips.map(slip => ({
      'Employee ID': slip.labMemberId,
      'Employee Name': slip.labMemberName,
      'Month': new Date(slip.year, slip.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
      'Base Salary': `₹${slip.baseSalary.toLocaleString('en-IN')}`,
      'Deductions': `₹${slip.totalDeductions.toLocaleString('en-IN')}`,
      'Net Salary': `₹${slip.netSalary.toLocaleString('en-IN')}`,
      'Status': slip.status,
    }));

    await exportToPDF(
      'All Payslips Report',
      payslipData,
      undefined,
      {
        'Total Records': mockSalarySlips.length,
        'Total Gross': `₹${mockSalarySlips.reduce((sum, s) => sum + s.baseSalary, 0).toLocaleString('en-IN')}`,
        'Total Deductions': `₹${mockSalarySlips.reduce((sum, s) => sum + s.totalDeductions, 0).toLocaleString('en-IN')}`,
      }
    );
  };

  const handleGenerateReport = async () => {
    const summary = mockPayrollSummary;
    const reportData = [{
      'Month': new Date(summary.year, summary.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
      'Total Employees': summary.totalEmployees,
      'Total Payroll': `₹${summary.totalNetPayroll.toLocaleString('en-IN')}`,
      'Processed': summary.processedCount,
      'Pending': summary.pendingCount,
    }];

    await exportToPDF(
      'Payroll Report',
      reportData,
      undefined,
      {
        'Total Payroll': `₹${summary.totalNetPayroll.toLocaleString('en-IN')}`,
        'Processed Count': summary.processedCount,
      }
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <MoneyIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4">Payroll & Deductions Management</Typography>
          <Typography color="text.secondary">
            Manage salary calculations, deductions, and generate payroll reports
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Payroll Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.success.main, 0.1), border: `1px solid ${theme.palette.success.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h4">{mockPayrollSummary.totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.primary.main, 0.1), border: `1px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Base Salary
              </Typography>
              <Typography variant="h6">₹{(mockPayrollSummary.totalBaseSalary / 100000).toFixed(1)}L</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${theme.palette.warning.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Deductions
              </Typography>
              <Typography variant="h6">₹{(mockPayrollSummary.totalDeductions / 1000).toFixed(0)}K</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: alpha(theme.palette.info.main, 0.1), border: `1px solid ${theme.palette.info.main}` }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Net Payroll
              </Typography>
              <Typography variant="h6">₹{(mockPayrollSummary.totalNetPayroll / 100000).toFixed(2)}L</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Card>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="payroll tabs"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab
                label="Salary Calculation"
                id="payroll-tab-0"
                aria-controls="payroll-tabpanel-0"
              />
              <Tab
                label="Deductions & PF/ESI"
                id="payroll-tab-1"
                aria-controls="payroll-tabpanel-1"
              />
              <Tab
                label="Payslip Generation"
                id="payroll-tab-2"
                aria-controls="payroll-tabpanel-2"
              />
              <Tab
                label="Payroll Reports"
                id="payroll-tab-3"
                aria-controls="payroll-tabpanel-3"
              />
            </Tabs>

            {/* Salary Calculation Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Salary Calculation Overview
              </Typography>
              <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Base Salary
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Overtime
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Incentives
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Deductions
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Net Salary
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockSalarySlips.slice(0, 5).map((slip) => (
                      <TableRow key={slip.id} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{slip.labMemberName}</TableCell>
                        <TableCell align="right">₹{slip.baseSalary.toLocaleString('en-IN')}</TableCell>
                        <TableCell align="right">₹0</TableCell>
                        <TableCell align="right">₹0</TableCell>
                        <TableCell align="right">₹{slip.totalDeductions.toLocaleString('en-IN')}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                          ₹{slip.netSalary.toLocaleString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="outlined" sx={{ mt: 3 }} onClick={handleGenerateReport}>
                Recalculate All Salaries
              </Button>
            </TabPanel>

            {/* Deductions Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Deduction Types</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddDeduction} size="small">
                  Add Deduction
                </Button>
              </Box>

              <Grid container spacing={2}>
                {deductions.map((deduction) => (
                  <Grid item xs={12} md={6} key={deduction.id}>
                    <Card sx={{ background: alpha(theme.palette.warning.main, 0.05) }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6">{deduction.name}</Typography>
                            <Chip label={deduction.type} size="small" sx={{ mt: 1 }} />
                          </Box>
                          <Box>
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Stack spacing={1}>
                          {deduction.percentage ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="text.secondary">
                                Percentage
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {deduction.percentage}%
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="text.secondary">
                                Fixed Amount
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                ₹{deduction.amount}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Applicable to All
                            </Typography>
                            <Chip
                              label={deduction.isApplicableToAll ? 'Yes' : 'No'}
                              size="small"
                              color={deduction.isApplicableToAll ? 'success' : 'default'}
                            />
                          </Box>
                          {deduction.description && (
                            <Typography variant="caption" color="text.secondary">
                              {deduction.description}
                            </Typography>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Payslip Generation Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Payslip Generation & Management
              </Typography>
              <Card sx={{ p: 3, textAlign: 'center', mb: 3 }}>
                <MoneyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Generate payslips for January 2024
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="contained" startIcon={<AssessmentIcon />}>
                    Generate Payslips
                  </Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadPayslips}>
                    Download All
                  </Button>
                </Stack>
              </Card>

              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Recent Payslips
              </Typography>
              <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Month/Year
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Net Salary
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Status
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockSalarySlips.slice(0, 5).map((slip) => (
                      <TableRow key={slip.id}>
                        <TableCell sx={{ fontWeight: 500 }}>{slip.labMemberName}</TableCell>
                        <TableCell align="center">
                          {slip.month}/{slip.year}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          ₹{slip.netSalary.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={slip.status} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Button 
                            size="small" 
                            startIcon={<DownloadIcon />}
                            onClick={() => exportSalarySlipToPDF(slip)}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Payroll Reports Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Payroll Reports
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardHeader title="Monthly Payroll Summary" avatar={<AssessmentIcon />} />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Payroll
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            ₹{(mockPayrollSummary.totalNetPayroll / 100000).toFixed(2)}L
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Processed
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {mockPayrollSummary.processedCount}/{mockPayrollSummary.totalEmployees}
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                          startIcon={<DownloadIcon />}
                          onClick={handleGenerateReport}
                        >
                          Download Report
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardHeader title="Department-wise Report" avatar={<TrendingUpIcon />} />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Departments
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>5</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Salary
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            ₹{(mockPayrollSummary.totalBaseSalary / 100000).toFixed(1)}L
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                          startIcon={<DownloadIcon />}
                          onClick={handleGenerateReport}
                        >
                          Generate Report
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    <CardHeader title="Employee-wise Report" avatar={<AssessmentIcon />} />
                    <CardContent>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Employees
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>{mockPayrollSummary.totalEmployees}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">
                            Avg Salary
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            ₹{(mockPayrollSummary.totalBaseSalary / mockPayrollSummary.totalEmployees / 1000).toFixed(0)}K
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                          startIcon={<DownloadIcon />}
                          onClick={handleGenerateReport}
                        >
                          Export CSV
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Deduction Dialog */}
      <Dialog open={openDeductionDialog} onClose={() => setOpenDeductionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Add Deduction Type</span>
            <IconButton onClick={() => setOpenDeductionDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Deduction Name"
              value={deductionForm.name}
              onChange={(e) => setDeductionForm({ ...deductionForm, name: e.target.value })}
              placeholder="e.g., PF, ESI"
            />
            <TextField
              select
              fullWidth
              label="Type"
              value={deductionForm.type}
              onChange={(e) => setDeductionForm({ ...deductionForm, type: e.target.value })}
            >
              <MenuItem value="PF">PF (Provident Fund)</MenuItem>
              <MenuItem value="ESI">ESI (Employee State Insurance)</MenuItem>
              <MenuItem value="ADVANCE">Advance</MenuItem>
              <MenuItem value="PENALTY">Penalty</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
            <TextField
              type="number"
              label="Fixed Amount (₹)"
              value={deductionForm.amount}
              onChange={(e) => setDeductionForm({ ...deductionForm, amount: e.target.value })}
              placeholder="Or use percentage"
            />
            <TextField
              type="number"
              label="Percentage (%)"
              value={deductionForm.percentage}
              onChange={(e) => setDeductionForm({ ...deductionForm, percentage: e.target.value })}
              placeholder="Or use fixed amount"
              inputProps={{ step: 0.5 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={deductionForm.description}
              onChange={(e) => setDeductionForm({ ...deductionForm, description: e.target.value })}
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeductionDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveDeduction} variant="contained">
            Add Deduction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayrollAndDeductions;
