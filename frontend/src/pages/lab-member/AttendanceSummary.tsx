import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  FormControl,
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
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  alpha,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
} from "@mui/material";

import {
  Download as DownloadIcon,
  CalendarMonth as CalendarIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  RemoveCircle as HalfIcon,
  Event as EventIcon,
  Lock as LockIcon,
  TrendingUp,
  AccessTime,
  DateRange,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

import {
  AttendanceRecord,
  AttendanceStatus,
  getMonthOptions,
} from "@/types";
import { generateMockAttendanceRecords } from "@/services/mockData";
import { useThemeMode } from "@/contexts/ThemeContext";

/* =========================
   REUSABLE STYLES (BETTER UX)
========================= */

const GlassCard = ({ children, sx, isDark, ...props }: any) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        background: isDark
          ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)"
          : "linear-gradient(135deg, rgba(224, 242, 254, 0.8) 0%, rgba(186, 230, 253, 0.6) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isDark
          ? `1px solid ${alpha('#38bdf8', 0.3)}`
          : `1px solid ${alpha('#0284c7', 0.3)}`,
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.1)"
          : "0 8px 32px rgba(2, 132, 199, 0.15), 0 0 0 1px rgba(2, 132, 199, 0.1)",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

const ModernStatCard = ({ title, value, icon, color, isDark }: any) => {
  const theme = useTheme();
  const main = (theme.palette as any)[color]?.main || theme.palette.primary.main;

  return (
    <GlassCard
      isDark={isDark}
      sx={{
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: isDark ? "0 20px 40px rgba(56, 189, 248, 0.3)" : theme.shadows[12],
          "&::after": {
            animation: "shimmer 1.5s ease-in-out",
          },
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `linear-gradient(45deg, transparent 30%, ${alpha(main, 0.2)} 50%, transparent 70%)`,
          transform: "translateX(-100%)",
        },
        "@keyframes shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      }}
    >
      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            p: 1.5,
            width: 48,
            borderRadius: 2.5,
            bgcolor: isDark ? alpha('#38bdf8', 0.2) : alpha('#0284c7', 0.15),
            color: isDark ? '#38bdf8' : '#0284c7',
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, color: isDark ? '#38bdf8' : '#075985' }}>
          {value}
        </Typography>
        <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#94a3b8' : '#334155' }}>
          {title}
        </Typography>
      </CardContent>
    </GlassCard>
  );
};

const ProgressStatCard = ({ title, value, icon, color, percentage, isDark }: any) => {
  const theme = useTheme();
  const main = (theme.palette as any)[color]?.main || theme.palette.primary.main;
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <GlassCard
      isDark={isDark}
      sx={{
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: isDark ? "0 20px 40px rgba(56, 189, 248, 0.3)" : theme.shadows[12],
          "&::after": {
            animation: "shimmer 1.5s ease-in-out",
          },
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `linear-gradient(45deg, transparent 30%, ${alpha(main, 0.2)} 50%, transparent 70%)`,
          transform: "translateX(-100%)",
        },
        "@keyframes shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      }}
    >
      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box
              sx={{
                p: 1.5,
                width: 48,
                borderRadius: 2.5,
                bgcolor: isDark ? alpha('#38bdf8', 0.2) : alpha('#0284c7', 0.15),
                color: isDark ? '#38bdf8' : '#0284c7',
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>

            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, color: isDark ? '#38bdf8' : '#075985' }}>
              {value}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? '#94a3b8' : '#334155' }}>
              {title}
            </Typography>
          </Box>

          <Box position="relative" display="inline-flex">
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={alpha(main, 0.1)}
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={main}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" fontWeight={700} color={main}>
                {percentage}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </GlassCard>
  );
};

/* =========================
   MAIN COMPONENT (ADVANCED)
========================= */

const AttendanceSummary: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [transition, setTransition] = useState(false);

  const monthOptions = getMonthOptions();

  // Memoized data
  const attendance = useMemo(
    () => generateMockAttendanceRecords(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  // Calculate attendance streak
  const attendanceStreak = useMemo(() => {
    const sorted = [...attendance.records]
      .filter(r => r.status === "FULL")
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));

    let streak = 0;
    for (const record of sorted) {
      const date = new Date(record.date);
      const expected = new Date(today);
      expected.setDate(today.getDate() - streak);
      if (date.toDateString() === expected.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [attendance, today]);

  const handleMonthChange = useCallback((value: string) => {
    setTransition(true);
    setTimeout(() => {
      const [y, m] = value.split("-").map(Number);
      setSelectedYear(y);
      setSelectedMonth(m);
      setTransition(false);
    }, 150);
  }, []);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setTransition(true);
    setTimeout(() => {
      if (direction === "prev") {
        if (selectedMonth === 1) {
          setSelectedMonth(12);
          setSelectedYear(selectedYear - 1);
        } else {
          setSelectedMonth(selectedMonth - 1);
        }
      } else {
        if (selectedMonth === 12) {
          setSelectedMonth(1);
          setSelectedYear(selectedYear + 1);
        } else {
          setSelectedMonth(selectedMonth + 1);
        }
      }
      setTransition(false);
    }, 150);
  }, [selectedMonth, selectedYear]);

  const getStatusConfig = (status: AttendanceStatus) => {
    const map: any = {
      FULL: { icon: <CheckIcon fontSize="small" />, label: "Full Day", color: "success", bgColor: alpha(theme.palette.success.main, 0.12) },
      HALF: { icon: <HalfIcon fontSize="small" />, label: "Half Day", color: "warning", bgColor: alpha(theme.palette.warning.main, 0.12) },
      LOP: { icon: <CancelIcon fontSize="small" />, label: "Loss of Pay", color: "error", bgColor: alpha(theme.palette.error.main, 0.12) },
      HOLIDAY: { icon: <EventIcon fontSize="small" />, label: "Holiday", color: "info", bgColor: alpha(theme.palette.info.main, 0.12) },
      WEEKEND: { icon: <EventIcon fontSize="small" />, label: "Weekend", color: "grey", bgColor: "transparent" },
    };
    return map[status] || map.HOLIDAY;
  };

  // Calendar generator
  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const grid: (AttendanceRecord | null)[] = Array(startDay).fill(null);

    for (let d = 1; d <= totalDays; d++) {
      const date = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const record =
        attendance.records.find((r) => r.date === date) ||
        ({
          id: 0,
          labMemberId: 0,
          date,
          status:
            new Date(date).getDay() === 0 || new Date(date).getDay() === 6
              ? "WEEKEND"
              : "LOP",
          createdAt: "",
          updatedAt: "",
        } as AttendanceRecord);

      grid.push(record);
    }
    return grid;
  }, [attendance, selectedMonth, selectedYear]);

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleDayClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  // Export to CSV (Excel-compatible)
  const exportToExcel = () => {
    const headers = ["Date", "Status", "Check In", "Check Out", "Total Hours", "Work Log"];
    const rows = attendance.records.map(record => [
      record.date,
      record.status,
      (record as any).checkInTime || "-",
      (record as any).checkOutTime || "-",
      (record as any).totalHours || "-",
      (record as any).workLog || "-"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_${selectedYear}_${selectedMonth}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const monthName = monthOptions.find(o => o.month === selectedMonth && o.year === selectedYear)?.label || "";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Report - ${monthName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #6366f1; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #6366f1; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Attendance Report</h1>
          <div class="summary">
            <h2>${monthName}</h2>
            <p><strong>Total Working Days:</strong> ${(attendance as any).summary?.totalWorkingDays || attendance.records.length}</p>
            <p><strong>Present Days:</strong> ${(attendance as any).summary?.presentDays || attendance.records.filter((r: any) => r.status === 'PRESENT').length}</p>
            <p><strong>Absent Days:</strong> ${(attendance as any).summary?.absentDays || attendance.records.filter((r: any) => r.status === 'ABSENT' || r.status === 'LOP').length}</p>
            <p><strong>Half Days:</strong> ${(attendance as any).summary?.halfDays || attendance.records.filter((r: any) => r.status === 'HALF_DAY').length}</p>
            <p><strong>Attendance Rate:</strong> ${(attendance as any).summary?.attendanceRate || '0'}%</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Work Log</th>
              </tr>
            </thead>
            <tbody>
              ${attendance.records.map(record => `
                <tr>
                  <td>${record.date}</td>
                  <td>${record.status}</td>
                  <td>${(record as any).checkInTime || "-"}</td>
                  <td>${(record as any).checkOutTime || "-"}</td>
                  <td>${(record as any).totalHours || "-"}</td>
                  <td>${(record as any).workLog || "-"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Box sx={{
      position: "relative",
      maxWidth: 1600,
      mx: "auto",
      p: { xs: 2, md: 4 },
      minHeight: "100vh",
      background: isDarkMode
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
        : "linear-gradient(135deg, #a78bfa 0%, #818cf8 20%, #60a5fa 40%, #38bdf8 60%, #818cf8 80%, #a78bfa 100%)",
      transition: "background 0.5s ease",
    }}>
      {/* ANIMATED BACKGROUND OVERLAY */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.4,
          background: isDarkMode
            ? `radial-gradient(circle at 20% 50%, ${alpha('#38bdf8', 0.2)} 0%, transparent 50%),
               radial-gradient(circle at 80% 80%, ${alpha('#818cf8', 0.2)} 0%, transparent 50%),
               radial-gradient(circle at 50% 20%, ${alpha('#06b6d4', 0.15)} 0%, transparent 60%)`
            : `radial-gradient(circle at 20% 50%, ${alpha('#0ea5e9', 0.3)} 0%, transparent 50%),
               radial-gradient(circle at 80% 80%, ${alpha('#06b6d4', 0.3)} 0%, transparent 50%),
               radial-gradient(circle at 50% 20%, ${alpha('#38bdf8', 0.2)} 0%, transparent 60%)`,
          animation: "float 20s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />

      {/* DECORATIVE CIRCLES */}
      <Box
        sx={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: isDarkMode
            ? `radial-gradient(circle, ${alpha('#38bdf8', 0.1)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha('#a78bfa', 0.3)} 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "pulse 8s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.5, transform: "scale(1)" },
            "50%": { opacity: 0.8, transform: "scale(1.1)" },
          },
        }}
      />

      <Box
        sx={{
          position: "fixed",
          bottom: "-10%",
          left: "-5%",
          width: "35%",
          height: "35%",
          borderRadius: "50%",
          background: isDarkMode
            ? `radial-gradient(circle, ${alpha('#818cf8', 0.1)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha('#818cf8', 0.3)} 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "pulse 10s ease-in-out infinite reverse",
        }}
      />

      {/* HEADER TOOLBAR */}
      <GlassCard
        isDark={isDarkMode}
        sx={{
          mb: 4,
          p: 3,
          position: "relative",
          zIndex: 1,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 255, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode
            ? '1px solid rgba(139, 92, 246, 0.2)'
            : '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(139, 92, 246, 0.12)',
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={3}
        >
          <Box display="flex" alignItems="center" gap={2.5}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                background: isDarkMode
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isDarkMode
                  ? '0 4px 16px rgba(139, 92, 246, 0.4)'
                  : '0 4px 16px rgba(139, 92, 246, 0.3)',
              }}
            >
              <DateRange sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: isDarkMode ? '#e0e7ff' : '#1e1b4b',
                  mb: 0.5,
                  letterSpacing: '-0.5px'
                }}
              >
                Attendance Management
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? '#94a3b8' : '#6b7280',
                  fontWeight: 500
                }}
              >
                Monthly performance & availability tracking
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            {attendanceStreak > 0 && (
              <Chip
                icon={<TrendingUp />}
                label={`${attendanceStreak} day streak! 🔥`}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            )}

            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              sx={{
                background: isDarkMode
                  ? 'rgba(139, 92, 246, 0.1)'
                  : 'rgba(139, 92, 246, 0.05)',
                padding: '8px 12px',
                borderRadius: '12px',
                border: isDarkMode
                  ? '1px solid rgba(139, 92, 246, 0.2)'
                  : '1px solid rgba(139, 92, 246, 0.1)',
              }}
            >
              <IconButton
                size="small"
                onClick={() => navigateMonth("prev")}
                sx={{
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'white',
                  boxShadow: isDarkMode ? 1 : 2,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#f9fafb',
                    transform: 'translateX(-2px)',
                  },
                  transition: 'all 0.2s'
                }}
              >
                <ChevronLeft />
              </IconButton>

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={`${selectedYear}-${selectedMonth}`}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
                    boxShadow: 1,
                    fontWeight: 600,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)',
                    },
                  }}
                >
                  {monthOptions.map((o) => (
                    <MenuItem key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <IconButton
                size="small"
                onClick={() => navigateMonth("next")}
                sx={{
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'white',
                  boxShadow: isDarkMode ? 1 : 2,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#f9fafb',
                    transform: 'translateX(2px)',
                  },
                  transition: 'all 0.2s'
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
              size="small"
              sx={{
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
                boxShadow: 1,
                borderRadius: 2,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)',
                    color: isDarkMode ? '#c4b5fd' : '#7c3aed',
                  }
                }
              }}
            >
              <ToggleButton value="calendar">
                <GridIcon sx={{ mr: 1 }} /> Grid
              </ToggleButton>
              <ToggleButton value="list">
                <ListIcon sx={{ mr: 1 }} /> List
              </ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title="Export to PDF">
              <IconButton
                onClick={exportToPDF}
                sx={{
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'white',
                  boxShadow: 2,
                  '&:hover': {
                    bgcolor: isDarkMode ? alpha('#a78bfa', 0.2) : alpha('#8b5cf6', 0.1),
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                  transition: 'all 0.2s'
                }}
              >
                <DownloadIcon sx={{ color: isDarkMode ? '#a78bfa' : '#8b5cf6' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export to Excel (CSV)">
              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={exportToExcel}
                sx={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'
                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: isDarkMode
                    ? '0 4px 16px rgba(167, 139, 250, 0.4)'
                    : '0 4px 16px rgba(139, 92, 246, 0.3)',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  '&:hover': {
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)'
                      : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    boxShadow: isDarkMode
                      ? '0 6px 20px rgba(167, 139, 250, 0.5)'
                      : '0 6px 20px rgba(139, 92, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s'
                }}
              >
                Excel
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </GlassCard>

      {/* HERO STATS */}
      <Grid container spacing={3} sx={{ mb: 4, position: "relative", zIndex: 1 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <ModernStatCard
            title="Working Days"
            value={attendance.summary.workingDays}
            icon={<CalendarIcon />}
            color="primary"
            isDark={isDarkMode}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <ModernStatCard
            title="Present"
            value={attendance.summary.fullDays}
            icon={<CheckIcon />}
            color="success"
            isDark={isDarkMode}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <ModernStatCard
            title="Half Days"
            value={attendance.summary.halfDays}
            icon={<HalfIcon />}
            color="warning"
            isDark={isDarkMode}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <ModernStatCard
            title="Leaves / LOP"
            value={attendance.summary.lopDays}
            icon={<CancelIcon />}
            color="error"
            isDark={isDarkMode}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <ProgressStatCard
            title="Attendance"
            value={`${attendance.summary.attendancePercentage.toFixed(0)}%`}
            percentage={attendance.summary.attendancePercentage}
            icon={<TrendingUp />}
            color="secondary"
            isDark={isDarkMode}
          />
        </Grid>
      </Grid>

      <Fade in>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {viewMode === "calendar" ? (
            <GlassCard isDark={isDarkMode} sx={{ p: 4 }}>
              {attendance.summary.isFrozen && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isDarkMode ? alpha('#38bdf8', 0.15) : alpha(theme.palette.info.main, 0.08),
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <LockIcon sx={{ color: isDarkMode ? '#38bdf8' : 'info.main' }} />
                  <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#38bdf8' : 'info.main' }}>
                    Attendance Frozen on{" "}
                    {new Date(attendance.summary.frozenAt!).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              <Grid container sx={{ mb: 2 }}>
                {weekDays.map((day) => (
                  <Grid size={{ xs: 12 / 7 }} key={day} textAlign="center">
                    <Typography variant="caption" fontWeight={700} sx={{ color: isDarkMode ? '#94a3b8' : 'text.primary' }}>
                      {day}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Fade in={!transition} timeout={300}>
                <Grid container spacing={2}>
                  {calendarDays.map((record, i) => {
                    if (!record) return <Grid size={{ xs: 12 / 7 }} key={i} />;

                    const cfg = getStatusConfig(record.status);
                    const isToday = record.date === today.toISOString().split("T")[0];

                    return (
                      <Grid size={{ xs: 12 / 7 }} key={i}>
                        <Tooltip title={`${cfg.label} - ${new Date(record.date).toDateString()}`} arrow placement="top">
                          <Paper
                            onClick={() => handleDayClick(record)}
                            elevation={isToday ? 4 : 0}
                            sx={{
                              height: { xs: 90, sm: 130 },
                              p: 2,
                              borderRadius: 3,
                              border: "2px solid",
                              borderColor: isToday
                                ? (isDarkMode ? '#38bdf8' : 'primary.main')
                                : alpha(cfg.color === 'grey' ? theme.palette.grey[400] : theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.main || theme.palette.primary.main, isDarkMode ? 0.3 : 0.2),
                              background: isDarkMode
                                ? (record.status === "WEEKEND"
                                  ? `linear-gradient(135deg, ${alpha('#1e293b', 0.5)} 0%, ${alpha('#0f172a', 0.7)} 100%)`
                                  : `linear-gradient(135deg, 
                                      ${alpha('#1e293b', 0.8)} 0%, 
                                      ${alpha('#0f172a', 0.9)} 50%,
                                      ${alpha(theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.main || theme.palette.primary.main, 0.1)} 100%)`)
                                : (record.status === "WEEKEND"
                                  ? `linear-gradient(135deg, ${alpha(theme.palette.grey[400], 0.03)} 0%, ${alpha(theme.palette.grey[300], 0.05)} 100%)`
                                  : `linear-gradient(135deg, 
                                      ${alpha(theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.light || theme.palette.primary.light, 0.1)} 0%, 
                                      ${alpha(theme.palette.background.paper, 0.95)} 50%,
                                      ${alpha(theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.main || theme.palette.primary.main, 0.05)} 100%)`),
                              backdropFilter: "blur(10px)",
                              cursor: "pointer",
                              position: "relative",
                              overflow: "hidden",
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                transform: record.status !== "WEEKEND" ? "translateY(-6px) scale(1.02)" : "none",
                                boxShadow: record.status !== "WEEKEND" ? 10 : 0,
                                borderColor: record.status !== "WEEKEND" ? `${cfg.color}.main` : "divider",
                                background: record.status !== "WEEKEND"
                                  ? (isDarkMode
                                    ? `linear-gradient(135deg, 
                                        ${alpha(theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.main || theme.palette.primary.main, 0.3)} 0%, 
                                        ${alpha('#1e293b', 0.9)} 100%)`
                                    : `linear-gradient(135deg, 
                                        ${alpha(theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.main || theme.palette.primary.main, 0.2)} 0%, 
                                        ${alpha(theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.light || theme.palette.primary.light, 0.15)} 100%)`)
                                  : undefined,
                                "& .day-number": { color: `${cfg.color}.main` },
                                "&::before": record.status !== "WEEKEND" ? {
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: `radial-gradient(circle, ${alpha(theme.palette[cfg.color as 'success' | 'warning' | 'error' | 'info']?.main || theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                                  opacity: 0,
                                  animation: "ripple 0.6s ease-out",
                                } : {},
                              },
                              "@keyframes ripple": {
                                "0%": { opacity: 1, transform: "scale(0)" },
                                "100%": { opacity: 0, transform: "scale(2.5)" },
                              },
                            }}
                          >
                            {isToday && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  bgcolor: isDarkMode ? '#38bdf8' : 'primary.main',
                                  color: "white",
                                  fontSize: "0.6rem",
                                  px: 1,
                                  py: 0.3,
                                  borderRadius: "0 0 0 8px",
                                  fontWeight: 700,
                                }}
                              >
                                TODAY
                              </Box>
                            )}

                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                              <Typography
                                className="day-number"
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                  color: record.status === "WEEKEND"
                                    ? (isDarkMode ? alpha('#94a3b8', 0.5) : "text.disabled")
                                    : (isDarkMode ? '#e2e8f0' : "text.primary"),
                                  transition: "color 0.2s",
                                }}
                              >
                                {new Date(record.date).getDate()}
                              </Typography>
                              <Box sx={{ color: `${cfg.color}.main` }}>
                                {cfg.icon}
                              </Box>
                            </Box>

                            {record.status !== "WEEKEND" && (
                              <Box mt="auto">
                                <Chip
                                  label={cfg.label}
                                  size="small"
                                  color={cfg.color as any}
                                  sx={{
                                    width: "100%",
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    height: 22,
                                  }}
                                />
                              </Box>
                            )}
                          </Paper>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>
              </Fade>
            </GlassCard>
          ) : (
            <GlassCard isDark={isDarkMode}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: isDarkMode ? '#94a3b8' : 'text.primary', fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ color: isDarkMode ? '#94a3b8' : 'text.primary', fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ color: isDarkMode ? '#94a3b8' : 'text.primary', fontWeight: 700 }}>Remarks</TableCell>
                      <TableCell sx={{ color: isDarkMode ? '#94a3b8' : 'text.primary', fontWeight: 700 }}>Logged By</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {attendance.records
                      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
                      .map((r) => {
                        const cfg = getStatusConfig(r.status);
                        return (
                          <TableRow key={r.id} sx={{ "&:hover": { bgcolor: isDarkMode ? alpha('#38bdf8', 0.05) : alpha('#0284c7', 0.03) } }}>
                            <TableCell sx={{ color: isDarkMode ? '#e2e8f0' : 'text.primary' }}>
                              {new Date(r.date).toDateString()}
                            </TableCell>
                            <TableCell>
                              <Chip label={cfg.label} color={cfg.color as any} />
                            </TableCell>
                            <TableCell sx={{ color: isDarkMode ? '#cbd5e1' : 'text.secondary' }}>{r.remarks || "—"}</TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1} sx={{ color: isDarkMode ? '#94a3b8' : 'text.secondary' }}>
                                <AccessTime fontSize="small" />
                                {r.markedByName || "System"}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </GlassCard>
          )}
        </Box>
      </Fade>

      {/* ATTENDANCE DETAILS DIALOG */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backdropFilter: "blur(20px)",
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha('#1e293b', 0.98)}, ${alpha('#0f172a', 0.98)})`
              : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.default, 0.95)})`,
            border: isDarkMode ? `1px solid ${alpha('#38bdf8', 0.2)}` : 'none',
          }
        }}
        TransitionComponent={Fade}
        transitionDuration={400}
      >
        {selectedRecord && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ color: isDarkMode ? '#38bdf8' : 'text.primary' }}>
                  {new Date(selectedRecord.date).toLocaleDateString(undefined, { weekday: 'long' })}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: isDarkMode ? '#94a3b8' : 'text.secondary' }}>
                  {new Date(selectedRecord.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
              <Chip
                label={getStatusConfig(selectedRecord.status).label}
                color={getStatusConfig(selectedRecord.status).color as any}
                variant="filled"
                sx={{ fontWeight: 700, borderRadius: 2 }}
              />
            </DialogTitle>
            <Divider sx={{ borderColor: isDarkMode ? alpha('#38bdf8', 0.1) : 'divider' }} />
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {selectedRecord.status === 'FULL' || selectedRecord.status === 'HALF' ? (
                  <>
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{
                        p: 2,
                        textAlign: 'center',
                        height: '100%',
                        borderRadius: 3,
                        bgcolor: isDarkMode ? alpha('#10b981', 0.15) : alpha(theme.palette.success.main, 0.08),
                        border: `1px solid ${isDarkMode ? alpha('#10b981', 0.3) : alpha(theme.palette.success.main, 0.1)}`
                      }}>
                        <Box sx={{ color: 'success.main', mb: 1 }}>
                          <AccessTime fontSize="large" color="inherit" />
                        </Box>
                        <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : 'text.secondary' }}>Check In</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: isDarkMode ? '#e2e8f0' : 'text.primary' }}>{selectedRecord.entryTime || '--:--'}</Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Paper elevation={0} sx={{
                        p: 2,
                        textAlign: 'center',
                        height: '100%',
                        borderRadius: 3,
                        bgcolor: isDarkMode ? alpha('#ef4444', 0.15) : alpha(theme.palette.error.main, 0.08),
                        border: `1px solid ${isDarkMode ? alpha('#ef4444', 0.3) : alpha(theme.palette.error.main, 0.1)}`
                      }}>
                        <Box sx={{ color: 'error.main', mb: 1 }}>
                          <AccessTime fontSize="large" color="inherit" sx={{ transform: 'scaleX(-1)' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: isDarkMode ? '#94a3b8' : 'text.secondary' }}>Check Out</Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ color: isDarkMode ? '#e2e8f0' : 'text.primary' }}>{selectedRecord.exitTime || '--:--'}</Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Paper elevation={0} sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: isDarkMode ? alpha('#38bdf8', 0.08) : alpha(theme.palette.primary.main, 0.04),
                        border: `1px dashed ${isDarkMode ? alpha('#38bdf8', 0.3) : alpha(theme.palette.primary.main, 0.2)}`
                      }}>
                        <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#94a3b8' : 'text.secondary' }} gutterBottom>
                          WORK LOG
                        </Typography>
                        <Typography variant="body1" fontWeight={500} sx={{ color: isDarkMode ? '#e2e8f0' : 'text.primary' }}>
                          {selectedRecord.workDescription || "No specific work log recorded for this day."}
                        </Typography>
                      </Paper>
                    </Grid>
                    {selectedRecord.totalHours && (
                      <Grid size={{ xs: 12 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor={isDarkMode ? alpha('#38bdf8', 0.1) : alpha(theme.palette.primary.main, 0.05)} p={2} borderRadius={2}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ color: isDarkMode ? '#94a3b8' : 'text.primary' }}>Total Hours</Typography>
                          <Typography variant="h6" fontWeight={800} sx={{ color: isDarkMode ? '#38bdf8' : 'primary.main' }}>{selectedRecord.totalHours.toFixed(1)} Hrs</Typography>
                        </Box>
                      </Grid>
                    )}
                  </>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: 'center', py: 4, opacity: 0.7 }}>
                      <EventIcon sx={{ fontSize: 48, color: isDarkMode ? '#475569' : 'text.disabled', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: isDarkMode ? '#94a3b8' : 'text.secondary' }}>
                        {selectedRecord.status === 'WEEKEND' ? 'It\'s the Weekend!' : selectedRecord.status === 'HOLIDAY' ? 'Public Holiday' : 'No records found for this day.'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailsOpen(false)} fullWidth variant="contained" size="large" sx={{ borderRadius: 3 }}>
                Close Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AttendanceSummary;
