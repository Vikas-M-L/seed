import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
  Error as DisputedIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { StatCard, DataTable, Column } from '@/components';
import { SalarySlip, getSalaryStatusColor, ExportFormat } from '@/types';
// Remove mockSalarySlips import

const SalarySlips: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch actual salary slips from API
  const { data: allSalarySlips = [], isLoading } = useQuery({
    queryKey: ['my-salary-slips'],
    queryFn: async () => {
      const response = await api.get('/payroll/my-salary-slips');
      return (response.data.data || response.data) as SalarySlip[];
    }
  });

  const salarySlips = useMemo(() =>
    allSalarySlips.filter(slip => slip.year === selectedYear),
    [allSalarySlips, selectedYear]
  );

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const totalEarnings = salarySlips?.reduce((sum, slip) => sum + slip.netSalary, 0) || 0;
  const totalDeductions = salarySlips?.reduce((sum, slip) => sum + slip.totalDeductions, 0) || 0;
  const avgSalary = salarySlips?.length ? totalEarnings / salarySlips.length : 0;

  const handleViewSlip = (slip: SalarySlip) => {
    setSelectedSlip(slip);
    setViewDialogOpen(true);
  };

  const handleDownload = async (slip: SalarySlip, format: ExportFormat) => {
    try {
      const response = await api.get(`/payroll/${slip.id}/download/${format}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const monthName = new Date(slip.year, slip.month - 1).toLocaleString('default', { month: 'long' });
      const filename = `Salary_Slip_${monthName}_${slip.year}.${format}`;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download salary slip');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return <ApprovedIcon sx={{ fontSize: 16 }} />;
      case 'PENDING':
        return <PendingIcon sx={{ fontSize: 16 }} />;
      case 'DISPUTED':
        return <DisputedIcon sx={{ fontSize: 16 }} />;
      default:
        return undefined;
    }
  };

  const columns: Column<SalarySlip>[] = [
    {
      id: 'month',
      label: 'Month',
      format: (_, row) => (
        <Typography variant="body2" fontWeight={500}>
          {new Date(row.year, row.month - 1).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
      ),
    },
    {
      id: 'daysWorked',
      label: 'Days Worked',
      align: 'center',
      format: (_, row) => `${row.daysWorked} / ${row.totalWorkingDays}`,
    },
    {
      id: 'baseSalary',
      label: 'Base Salary',
      align: 'right',
      format: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
    },
    {
      id: 'totalDeductions',
      label: 'Deductions',
      align: 'right',
      format: (value) => (
        <Typography variant="body2" color="error.main">
          -₹{Number(value).toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      id: 'netSalary',
      label: 'Net Salary',
      align: 'right',
      format: (value) => (
        <Typography variant="body2" fontWeight={600} color="primary.main">
          ₹{Number(value).toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      format: (value, row) => (
        <Chip
          icon={getStatusIcon(row.status)}
          label={value as string}
          size="small"
          color={getSalaryStatusColor(row.status)}
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
            <IconButton size="small" onClick={() => handleViewSlip(row)}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download PDF">
            <IconButton
              size="small"
              onClick={() => handleDownload(row, 'pdf')}
            >
              <PdfIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Excel">
            <IconButton
              size="small"
              onClick={() => handleDownload(row, 'xlsx')}
            >
              <ExcelIcon fontSize="small" color="success" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ position: "relative" }}>
      {/* ANIMATED BACKGROUND */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: "hidden",
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.success.light, 0.04)} 0%, 
            ${alpha(theme.palette.background.default, 1)} 50%,
            ${alpha(theme.palette.info.light, 0.04)} 100%)`,
        }}
      >
        <Box sx={{ position: "absolute", top: "10%", right: "-5%", width: "450px", height: "450px", borderRadius: "50%", background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.12)} 0%, transparent 70%)`, filter: "blur(60px)", animation: "float1 18s ease-in-out infinite", "@keyframes float1": { "0%, 100%": { transform: "translate(0, 0) scale(1)" }, "50%": { transform: "translate(-120px, 80px) scale(1.1)" } } }} />
        <Box sx={{ position: "absolute", bottom: "15%", left: "10%", width: "380px", height: "380px", borderRadius: "50%", background: `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.1)} 0%, transparent 70%)`, filter: "blur(50px)", animation: "float2 22s ease-in-out infinite", "@keyframes float2": { "0%, 100%": { transform: "translate(0, 0)" }, "50%": { transform: "translate(100px, -100px) scale(0.9)" } } }} />
        <Box sx={{ position: "absolute", top: "50%", left: "50%", width: "300px", height: "300px", borderRadius: "50%", background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`, filter: "blur(45px)", animation: "float3 20s ease-in-out infinite", "@keyframes float3": { "0%, 100%": { transform: "translate(-50%, -50%)" }, "33%": { transform: "translate(-30%, -70%)" }, "66%": { transform: "translate(-70%, -30%)" } } }} />
      </Box>

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
              Salary Slips
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and download your monthly salary slips
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Refresh">
              <IconButton onClick={() => window.location.reload()} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Earnings"
              value={`₹${totalEarnings.toLocaleString('en-IN')}`}
              subtitle={`${selectedYear}`}
              icon={<MoneyIcon />}
              color="success"
              loading={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Deductions"
              value={`₹${totalDeductions.toLocaleString('en-IN')}`}
              subtitle={`${selectedYear}`}
              icon={<MoneyIcon />}
              color="error"
              loading={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Average Salary"
              value={`₹${avgSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              subtitle="Per month"
              icon={<ReceiptIcon />}
              color="primary"
              loading={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Slips Generated"
              value={salarySlips?.length || 0}
              subtitle={`In ${selectedYear}`}
              icon={<ReceiptIcon />}
              color="info"
              loading={isLoading}
            />
          </Grid>
        </Grid>

        {/* Salary Slips Table */}
        {isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent>
                    <Skeleton height={30} />
                    <Skeleton height={50} />
                    <Skeleton height={30} />
                  </CardContent>
                </Card>
              ))
            ) : salarySlips?.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No salary slips found for {selectedYear}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              salarySlips?.map((slip) => (
                <Card key={slip.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {new Date(slip.year, slip.month - 1).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(slip.status)}
                          label={slip.status}
                          size="small"
                          color={getSalaryStatusColor(slip.status)}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        ₹{slip.netSalary.toLocaleString('en-IN')}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Days Worked</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {slip.daysWorked} / {slip.totalWorkingDays}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Deductions</Typography>
                        <Typography variant="body2" fontWeight={500} color="error.main">
                          -₹{slip.totalDeductions.toLocaleString('en-IN')}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewSlip(slip)}
                        sx={{ flex: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(slip, 'pdf')}
                        sx={{ flex: 1 }}
                      >
                        Download
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={salarySlips || []}
            loading={isLoading}
            title="Salary History"
            subtitle={`Showing salary slips for ${selectedYear}`}
            searchable={false}
            pagination={true}
            defaultRowsPerPage={12}
            getRowId={(row) => row.id}
            emptyMessage={`No salary slips found for ${selectedYear}`}
          />
        )}

        {/* View Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          {selectedSlip && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon color="primary" />
                  <Typography variant="h6">
                    Salary Slip - {new Date(selectedSlip.year, selectedSlip.month - 1).toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ textAlign: 'center', py: 2, mb: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h3" fontWeight={700} color="primary.main">
                    ₹{selectedSlip.netSalary.toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Net Salary
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedSlip.status)}
                    label={selectedSlip.status}
                    size="small"
                    color={getSalaryStatusColor(selectedSlip.status)}
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  EARNINGS
                </Typography>
                <List dense disablePadding>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary="Base Salary" />
                    <Typography variant="body2" fontWeight={500}>
                      ₹{selectedSlip.baseSalary.toLocaleString('en-IN')}
                    </Typography>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  DEDUCTIONS
                </Typography>
                <List dense disablePadding>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary={`Half Day Deductions (${selectedSlip.halfDays} days)`} />
                    <Typography variant="body2" color="error.main">
                      -₹{selectedSlip.halfDayDeductions.toLocaleString('en-IN')}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText primary={`LOP Deductions (${selectedSlip.lopDays} days)`} />
                    <Typography variant="body2" color="error.main">
                      -₹{selectedSlip.lopDeductions.toLocaleString('en-IN')}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={<Typography fontWeight={600}>Total Deductions</Typography>}
                    />
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      -₹{selectedSlip.totalDeductions.toLocaleString('en-IN')}
                    </Typography>
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  ATTENDANCE SUMMARY
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(40, 167, 69, 0.08)', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="success.main">
                        {selectedSlip.fullDays}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Full Days
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 193, 7, 0.08)', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="warning.main">
                        {selectedSlip.halfDays}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Half Days
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(220, 53, 69, 0.08)', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="error.main">
                        {selectedSlip.lopDays}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        LOP Days
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 102, 204, 0.08)', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        {selectedSlip.daysWorked}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Worked
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {selectedSlip.remarks && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      REMARKS
                    </Typography>
                    <Typography variant="body2">{selectedSlip.remarks}</Typography>
                  </>
                )}

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Generated on: {new Date(selectedSlip.generatedAt).toLocaleString()}
                  </Typography>
                  {selectedSlip.approvedAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Approved on: {new Date(selectedSlip.approvedAt).toLocaleString()}
                      {selectedSlip.approvedBy && ` by ${selectedSlip.approvedBy}`}
                    </Typography>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={() => window.print()}
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<ExcelIcon />}
                  onClick={() => handleDownload(selectedSlip, 'xlsx')}
                >
                  Excel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PdfIcon />}
                  onClick={() => handleDownload(selectedSlip, 'pdf')}
                >
                  Download PDF
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default SalarySlips;
