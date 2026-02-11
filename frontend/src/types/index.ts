// ============================================
// Attend Ease - TypeScript Type Definitions
// Samsung SEED Labs Enterprise Application
// ============================================

// User & Authentication Types
export interface User {
  id: string; // UUID from backend
  email: string;
  name: string;
  role: UserRole;
  employeeId?: string;
  designation?: string;
  labId?: number;
  labName?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  status: UserStatus;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'LAB_MEMBER' | 'LAB_ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    employeeId: string;
    name: string;
    email: string;
    role: string;
    designation: string;
  };
}

// Attendance Types
export type AttendanceStatus = 'FULL' | 'HALF' | 'LOP' | 'HOLIDAY' | 'WEEKEND';

export interface AttendanceRecord {
  id: number;
  labMemberId: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy?: number;
  markedByName?: string;
  entryTime?: string; // HH:MM
  exitTime?: string; // HH:MM
  totalHours?: number;
  workDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  month: number;
  year: number;
  totalDays: number;
  workingDays: number;
  fullDays: number;
  halfDays: number;
  lopDays: number;
  holidays: number;
  effectiveWorkingDays: number;
  attendancePercentage: number;
  isFrozen: boolean;
  frozenAt?: string;
  frozenBy?: string;
}

export interface MonthlyAttendance {
  summary: AttendanceSummary;
  records: AttendanceRecord[];
}

// Salary Types
export interface SalaryConfig {
  id: number;
  labId: number;
  baseAmount: number;
  halfDayDeduction: number;
  lopDeduction: number;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
}

export interface SalarySlip {
  id: number;
  labMemberId: number;
  labMemberName: string;
  month: number;
  year: number;
  baseSalary: number;
  totalWorkingDays: number;
  daysWorked: number;
  fullDays: number;
  halfDays: number;
  lopDays: number;
  halfDayDeductions: number;
  lopDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: SalarySlipStatus;
  generatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  remarks?: string;
}

export type SalarySlipStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'PAID' | 'DISPUTED';

// Lab Types
export interface Lab {
  id: number;
  name: string;
  code: string;
  description?: string;
  adminId?: number;
  adminName?: string;
  memberCount: number;
  status: LabStatus;
  createdAt: string;
  updatedAt: string;
}

export type LabStatus = 'ACTIVE' | 'INACTIVE';

export interface LabMember {
  id: number;
  userId: number;
  labId: number;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  endDate?: string;
  status: UserStatus;
  role: UserRole;
  baseSalary: number;
}

// Dashboard Types
export interface DashboardStats {
  // Lab Member Stats
  currentMonthAttendance?: AttendanceSummary;
  lastMonthSalary?: SalarySlip;
  pendingSalarySlips?: number;

  // Admin Stats
  totalMembers?: number;
  activeMembers?: number;
  pendingApprovals?: number;
  monthlyPayroll?: number;
  attendanceRate?: number;

  // Super Admin Stats
  totalLabs?: number;
  activeLabs?: number;
  totalUsers?: number;
  monthlyRevenue?: number;
  totalPaidThisMonth?: number;
  pendingSalaries?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path?: string;
}

// Form Types
export interface AttendanceFormData {
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  labId?: number;
  baseSalary?: number;
}

// Filter & Sort Types
export interface AttendanceFilter {
  month?: number;
  year?: number;
  status?: AttendanceStatus;
  memberId?: number;
}

export interface SalaryFilter {
  month?: number;
  year?: number;
  status?: SalarySlipStatus;
  memberId?: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Export Format Types
export type ExportFormat = 'pdf' | 'xlsx' | 'csv';

// Audit Types
export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  oldValue?: string;
  newValue?: string;
  performedBy: number;
  performedByName: string;
  performedAt: string;
  ipAddress?: string;
}

// Notification Types
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

// Leave Application Types
export type LeaveType = 'CASUAL' | 'MEDICAL' | 'EARNED' | 'UNPAID' | 'MATERNITY' | 'PATERNITY';
export type LeaveApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveApplication {
  id: number;
  labMemberId: number;
  labMemberName: string;
  labMemberEmail: string;
  labId: number;
  labName: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  numberOfDays: number;
  reason: string;
  status: LeaveApplicationStatus;
  approvedBy?: number;
  approvedByName?: string;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Month/Year Selection
export interface MonthYear {
  month: number;
  year: number;
  label: string;
}

// Helper function to get month options
export const getMonthOptions = (): MonthYear[] => {
  const months: MonthYear[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
    });
  }

  return months;
};

// Status color mapping
export const getStatusColor = (status: AttendanceStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'FULL':
      return 'success';
    case 'HALF':
      return 'warning';
    case 'LOP':
      return 'error';
    case 'HOLIDAY':
      return 'info';
    case 'WEEKEND':
      return 'default';
    default:
      return 'default';
  }
};

export const getSalaryStatusColor = (status: SalarySlipStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'APPROVED':
    case 'PAID':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'DISPUTED':
      return 'error';
    case 'DRAFT':
      return 'default';
    default:
      return 'default';
  }
};

// Shift & Roster Types
export type ShiftType = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | 'FLEXIBLE';
export type ShiftStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Shift {
  id: number;
  name: string;
  type: ShiftType;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  breakDuration: number; // in minutes
  totalWorkHours: number;
  description?: string;
  status: ShiftStatus;
  createdAt: string;
}

export interface RosterAssignment {
  id: number;
  labMemberId: number;
  labMemberName: string;
  shiftId: number;
  shiftName: string;
  weekStartDate: string; // YYYY-MM-DD
  weekEndDate: string; // YYYY-MM-DD
  assignedBy: number;
  assignedByName: string;
  status: 'ASSIGNED' | 'CONFIRMED' | 'CHANGED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

// Overtime & Work Hours Types
export interface OvertimeRequest {
  id: number;
  labMemberId: number;
  labMemberName: string;
  date: string; // YYYY-MM-DD
  overtimeHours: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy: number;
  approvedByName: string;
  approvalDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkHours {
  id: number;
  labMemberId: number;
  labMemberName: string;
  month: number;
  year: number;
  totalWorkHours: number;
  overtimeHours: number;
  extraHours: number;
  standardWorkHours: number;
}

// Payroll & Deductions Types
export interface Deduction {
  id: number;
  name: string;
  type: 'PF' | 'ESI' | 'ADVANCE' | 'PENALTY' | 'OTHER';
  amount: number;
  percentage?: number;
  isApplicableToAll: boolean;
  description?: string;
  createdAt: string;
}

export interface PayrollSummary {
  id: number;
  month: number;
  year: number;
  totalEmployees: number;
  totalBaseSalary: number;
  totalOvertime: number;
  totalIncentives: number;
  totalDeductions: number;
  totalNetPayroll: number;
  processedCount: number;
  pendingCount: number;
  generatedAt: string;
}

export interface PayrollReport {
  id: number;
  reportType: 'MONTHLY' | 'DEPARTMENT_WISE' | 'EMPLOYEE_WISE';
  month: number;
  year: number;
  totalRecords: number;
  totalAmount: number;
  summary: PayrollSummary;
  generatedAt: string;
  generatedBy: string;
}

// Announcement Types
export type AnnouncementTarget = 'ALL' | 'ADMIN_ONLY' | 'SPECIFIC_LAB' | 'SPECIFIC_MEMBERS';

export interface Announcement {
  id: number;
  title: string;
  description: string;
  content: string;
  createdBy: number;
  createdByName: string;
  createdByRole: UserRole;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  labId?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  targetType: AnnouncementTarget;
  targetLabIds?: number[];
  targetMemberIds?: number[];
}

export interface CreateAnnouncementRequest {
  title: string;
  description: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  expiresAt?: string;
  targetType: AnnouncementTarget;
  targetLabIds?: number[];
  targetMemberIds?: number[];
}

export interface UpdateAnnouncementRequest {
  title: string;
  description: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  expiresAt?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  targetType: AnnouncementTarget;
  targetLabIds?: number[];
  targetMemberIds?: number[];
}
