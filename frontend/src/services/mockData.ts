// Mock Data for Frontend Demo (No Backend Required)

import {
  AttendanceSummary,
  AttendanceRecord,
  MonthlyAttendance,
  SalarySlip,
  Lab,
  LabMember,
  User,
  DashboardStats,
  AttendanceStatus,
  LeaveApplication,
  Announcement,
} from '@/types';

// Helper function to generate dates
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// ============================================
// Mock Attendance Data
// ============================================
export const generateMockAttendanceRecords = (year: number, month: number): MonthlyAttendance => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const records: AttendanceRecord[] = [];

  let fullDays = 0;
  let halfDays = 0;
  let lopDays = 0;
  let holidays = 0;
  let weekends = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    let status: AttendanceStatus;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = 'WEEKEND';
      weekends++;
    } else if (day === 15 || day === 26) {
      status = 'HOLIDAY';
      holidays++;
    } else if (day % 7 === 0) {
      status = 'HALF';
      halfDays++;
    } else if (day % 11 === 0) {
      status = 'LOP';
      lopDays++;
    } else {
      status = 'FULL';
      fullDays++;
    }

    let entryTime: string | undefined;
    let exitTime: string | undefined;
    let totalHours: number | undefined;
    let workDescription: string | undefined;

    const workLogs = [
      "Worked on login authentication module",
      "Resolved UI bugs in dashboard",
      "Team meeting and sprint planning",
      "Database schema design for user profile",
      "Implemented API integration for payments",
      "Code review and refactoring",
      "Documentation updates",
      "Client call and requirement gathering",
      "Integrated new chart library",
      "Fixed responsive layout issues"
    ];

    if (status === 'FULL') {
      const entryHour = 9 + Math.floor(Math.random() * 2); // 9 or 10
      const entryMin = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      entryTime = `${entryHour.toString().padStart(2, '0')}:${entryMin}`;

      const exitHour = 17 + Math.floor(Math.random() * 3); // 17, 18, 19
      const exitMin = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      exitTime = `${exitHour.toString().padStart(2, '0')}:${exitMin}`;

      totalHours = (exitHour - entryHour) + (parseInt(exitMin) - parseInt(entryMin)) / 60;
      workDescription = workLogs[Math.floor(Math.random() * workLogs.length)];
    } else if (status === 'HALF') {
      const entryHour = 9 + Math.floor(Math.random() * 2);
      const entryMin = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      entryTime = `${entryHour.toString().padStart(2, '0')}:${entryMin}`;

      const exitHour = 13 + Math.floor(Math.random() * 2); // 13 or 14
      exitTime = `${exitHour}:00`;

      totalHours = 4 + Math.random();
      workDescription = "Half day leave - Personal appointments";
    }

    records.push({
      id: day,
      labMemberId: 1,
      date: date.toISOString().split('T')[0],
      status,
      remarks: status === 'HOLIDAY' ? 'Public Holiday' : undefined,
      entryTime,
      exitTime,
      totalHours,
      workDescription,
      createdAt: getDateString(0),
      updatedAt: getDateString(0),
    });
  }

  const workingDays = daysInMonth - weekends - holidays;
  const effectiveWorkingDays = fullDays + (halfDays * 0.5);

  return {
    summary: {
      year,
      month,
      totalDays: daysInMonth,
      workingDays,
      fullDays,
      halfDays,
      lopDays,
      holidays,
      effectiveWorkingDays,
      attendancePercentage: (effectiveWorkingDays / workingDays) * 100,
      isFrozen: month < new Date().getMonth() + 1,
      frozenAt: month < new Date().getMonth() + 1 ? getDateString(5) : undefined,
    },
    records,
  };
};

export const mockAttendanceSummary: AttendanceSummary = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  totalDays: 30,
  workingDays: 22,
  fullDays: 18,
  halfDays: 2,
  lopDays: 1,
  holidays: 1,
  effectiveWorkingDays: 19,
  attendancePercentage: 86.36,
  isFrozen: false,
};

// ============================================
// Mock Salary Data
// ============================================
export const mockSalarySlips: SalarySlip[] = [
  {
    id: 1,
    labMemberId: 1,
    labMemberName: 'John Doe',
    month: 12,
    year: 2025,
    baseSalary: 50000,
    totalWorkingDays: 22,
    daysWorked: 20,
    fullDays: 18,
    halfDays: 2,
    lopDays: 2,
    halfDayDeductions: 2273,
    lopDeductions: 4545,
    totalDeductions: 6818,
    netSalary: 43182,
    status: 'PAID',
    generatedAt: getDateString(10),
    approvedAt: getDateString(5),
    approvedBy: 'Jane Smith',
  },
  {
    id: 2,
    labMemberId: 1,
    labMemberName: 'John Doe',
    month: 11,
    year: 2025,
    baseSalary: 50000,
    totalWorkingDays: 21,
    daysWorked: 21,
    fullDays: 21,
    halfDays: 0,
    lopDays: 0,
    halfDayDeductions: 0,
    lopDeductions: 0,
    totalDeductions: 0,
    netSalary: 50000,
    status: 'PAID',
    generatedAt: getDateString(40),
    approvedAt: getDateString(35),
    approvedBy: 'Jane Smith',
  },
  {
    id: 3,
    labMemberId: 1,
    labMemberName: 'John Doe',
    month: 10,
    year: 2025,
    baseSalary: 50000,
    totalWorkingDays: 23,
    daysWorked: 22,
    fullDays: 20,
    halfDays: 2,
    lopDays: 1,
    halfDayDeductions: 2174,
    lopDeductions: 2174,
    totalDeductions: 4348,
    netSalary: 45652,
    status: 'PAID',
    generatedAt: getDateString(70),
    approvedAt: getDateString(65),
    approvedBy: 'Jane Smith',
  },
];

export const mockCurrentSalary: SalarySlip = {
  id: 4,
  labMemberId: 1,
  labMemberName: 'John Doe',
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  baseSalary: 50000,
  totalWorkingDays: 22,
  daysWorked: 19,
  fullDays: 17,
  halfDays: 2,
  lopDays: 1,
  halfDayDeductions: 2273,
  lopDeductions: 2273,
  totalDeductions: 4546,
  netSalary: 45454,
  status: 'PENDING',
  generatedAt: getDateString(1),
};

// ============================================
// Mock Lab Members Data
// ============================================
export const mockLabMembers: LabMember[] = [
  {
    id: 1,
    userId: 1,
    labId: 1,
    name: 'John Doe',
    email: 'john.doe@seedlabs.com',
    phone: '+91 98765 43210',
    joinDate: '2024-01-15',
    status: 'ACTIVE',
    role: 'LAB_MEMBER',
    baseSalary: 50000,
  },
  {
    id: 2,
    userId: 2,
    labId: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@seedlabs.com',
    phone: '+91 98765 43211',
    joinDate: '2024-02-01',
    status: 'ACTIVE',
    role: 'LAB_MEMBER',
    baseSalary: 45000,
  },
  {
    id: 3,
    userId: 3,
    labId: 1,
    name: 'Bob Williams',
    email: 'bob.williams@seedlabs.com',
    phone: '+91 98765 43212',
    joinDate: '2024-03-10',
    status: 'ACTIVE',
    role: 'LAB_MEMBER',
    baseSalary: 48000,
  },
  {
    id: 4,
    userId: 4,
    labId: 1,
    name: 'Carol Davis',
    email: 'carol.davis@seedlabs.com',
    phone: '+91 98765 43213',
    joinDate: '2024-04-05',
    status: 'ACTIVE',
    role: 'LAB_MEMBER',
    baseSalary: 52000,
  },
  {
    id: 5,
    userId: 5,
    labId: 1,
    name: 'David Brown',
    email: 'david.brown@seedlabs.com',
    joinDate: '2024-05-20',
    endDate: '2025-11-30',
    status: 'INACTIVE',
    role: 'LAB_MEMBER',
    baseSalary: 40000,
  },
];

// ============================================
// Mock Labs Data
// ============================================
export const mockLabs: Lab[] = [
  {
    id: 1,
    name: 'AI Research Lab',
    code: 'AI-001',
    description: 'Artificial Intelligence and Machine Learning Research',
    adminId: 2,
    adminName: 'Jane Smith',
    memberCount: 5,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'IoT Development Lab',
    code: 'IOT-002',
    description: 'Internet of Things and Embedded Systems',
    adminId: 6,
    adminName: 'Mike Wilson',
    memberCount: 8,
    status: 'ACTIVE',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
  },
  {
    id: 3,
    name: 'Security Research Lab',
    code: 'SEC-003',
    description: 'Cybersecurity and Privacy Research',
    adminId: 7,
    adminName: 'Sarah Lee',
    memberCount: 4,
    status: 'ACTIVE',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z',
  },
  {
    id: 4,
    name: 'Data Analytics Lab',
    code: 'DATA-004',
    description: 'Big Data and Analytics Research',
    memberCount: 0,
    status: 'INACTIVE',
    createdAt: '2024-04-10T00:00:00Z',
    updatedAt: '2024-08-01T00:00:00Z',
  },
];

// ============================================
// Mock Users Data (for Super Admin)
// ============================================
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'john.doe@seedlabs.com',
    name: 'John Doe',
    role: 'LAB_MEMBER',
    labId: 1,
    labName: 'AI Research Lab',
    status: 'ACTIVE',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    email: 'jane.smith@seedlabs.com',
    name: 'Jane Smith',
    role: 'LAB_ADMIN',
    labId: 1,
    labName: 'AI Research Lab',
    status: 'ACTIVE',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 3,
    email: 'admin@seedlabs.com',
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    email: 'alice.johnson@seedlabs.com',
    name: 'Alice Johnson',
    role: 'LAB_MEMBER',
    labId: 1,
    labName: 'AI Research Lab',
    status: 'ACTIVE',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 5,
    email: 'bob.williams@seedlabs.com',
    name: 'Bob Williams',
    role: 'LAB_MEMBER',
    labId: 1,
    labName: 'AI Research Lab',
    status: 'ACTIVE',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 6,
    email: 'mike.wilson@seedlabs.com',
    name: 'Mike Wilson',
    role: 'LAB_ADMIN',
    labId: 2,
    labName: 'IoT Development Lab',
    status: 'ACTIVE',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 7,
    email: 'sarah.lee@seedlabs.com',
    name: 'Sarah Lee',
    role: 'LAB_ADMIN',
    labId: 3,
    labName: 'Security Research Lab',
    status: 'ACTIVE',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
];

// ============================================
// Mock Dashboard Stats
// ============================================
export const mockDashboardStats: DashboardStats = {
  totalMembers: 17,
  activeMembers: 15,
  totalLabs: 4,
  activeLabs: 3,
  pendingSalaries: 12,
  totalPaidThisMonth: 485000,
};

// ============================================
// Mock Admin Dashboard Data
// ============================================
export const mockAdminAttendanceOverview = {
  totalMembers: 5,
  presentToday: 4,
  absentToday: 1,
  onLeave: 0,
  attendanceRate: 80,
};

export const mockAdminSalaryOverview = {
  totalPayroll: 245000,
  pendingApprovals: 3,
  paidThisMonth: 2,
  averageSalary: 49000,
};

// ============================================
// Mock Leave Applications
// ============================================
export const mockLeaveApplications: LeaveApplication[] = [
  {
    id: 1,
    labMemberId: 1,
    labMemberName: 'John Doe',
    labMemberEmail: 'john.doe@seedlabs.com',
    labId: 1,
    labName: 'AI Research Lab',
    leaveType: 'CASUAL',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    numberOfDays: 3,
    reason: 'Personal commitment',
    status: 'PENDING',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 2,
    labMemberId: 2,
    labMemberName: 'Alice Johnson',
    labMemberEmail: 'alice.johnson@seedlabs.com',
    labId: 1,
    labName: 'AI Research Lab',
    leaveType: 'MEDICAL',
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    numberOfDays: 2,
    reason: 'Medical appointment and recovery',
    status: 'PENDING',
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
  },
  {
    id: 3,
    labMemberId: 3,
    labMemberName: 'Bob Williams',
    labMemberEmail: 'bob.williams@seedlabs.com',
    labId: 1,
    labName: 'AI Research Lab',
    leaveType: 'EARNED',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    numberOfDays: 5,
    reason: 'Vacation and rest',
    status: 'APPROVED',
    approvedBy: 3,
    approvedByName: 'Admin User',
    approvalDate: '2024-01-13T09:00:00Z',
    createdAt: '2024-01-11T11:00:00Z',
    updatedAt: '2024-01-13T09:00:00Z',
  },
  {
    id: 4,
    labMemberId: 4,
    labMemberName: 'Emma Thompson',
    labMemberEmail: 'emma.thompson@seedlabs.com',
    labId: 2,
    labName: 'IoT Development Lab',
    leaveType: 'CASUAL',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    numberOfDays: 2,
    reason: 'Family event',
    status: 'REJECTED',
    approvedBy: 3,
    approvedByName: 'Admin User',
    rejectionReason: 'Conflict with project deadline',
    approvalDate: '2024-01-13T10:30:00Z',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-13T10:30:00Z',
  },
  {
    id: 5,
    labMemberId: 5,
    labMemberName: 'David Chen',
    labMemberEmail: 'david.chen@seedlabs.com',
    labId: 2,
    labName: 'IoT Development Lab',
    leaveType: 'MEDICAL',
    startDate: '2024-01-22',
    endDate: '2024-01-23',
    numberOfDays: 2,
    reason: 'Dental procedure',
    status: 'PENDING',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
  },
  {
    id: 6,
    labMemberId: 1,
    labMemberName: 'John Doe',
    labMemberEmail: 'john.doe@seedlabs.com',
    labId: 1,
    labName: 'AI Research Lab',
    leaveType: 'UNPAID',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    numberOfDays: 3,
    reason: 'Extended family travel',
    status: 'PENDING',
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z',
  },
];

// ============================================
// Mock Announcements Data
// ============================================
export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Lab Maintenance Notice',
    description: 'Important maintenance will be performed on the lab infrastructure.',
    content: 'The lab facilities will undergo scheduled maintenance on weekends. Please ensure all equipment is properly shut down before Friday EOD.',
    createdBy: 2,
    createdByName: 'Jane Smith',
    createdByRole: 'LAB_ADMIN',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    expiresAt: '2024-02-03T23:59:59Z',
    priority: 'HIGH',
    labId: 1,
    status: 'ACTIVE',
    targetType: 'SPECIFIC_LAB',
    targetLabIds: [1],
  },
  {
    id: 2,
    title: 'New Lab Rules and Regulations',
    description: 'Updated safety guidelines for all lab members.',
    content: 'All lab members must read and acknowledge the new safety guidelines. Please complete the training module in the portal by January 30th.',
    createdBy: 3,
    createdByName: 'Admin User',
    createdByRole: 'SUPER_ADMIN',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    priority: 'HIGH',
    status: 'ACTIVE',
    targetType: 'ALL',
  },
  {
    id: 3,
    title: 'Team Building Event',
    description: 'Join us for our upcoming team building activity.',
    content: 'We are organizing a team building event on February 5th. Registration link has been shared via email. Limited seats available!',
    createdBy: 2,
    createdByName: 'Jane Smith',
    createdByRole: 'LAB_ADMIN',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    priority: 'MEDIUM',
    labId: 1,
    status: 'ACTIVE',
    targetType: 'SPECIFIC_LAB',
    targetLabIds: [1],
  },
  {
    id: 4,
    title: 'Quarterly Review Schedule',
    description: 'Performance review meetings scheduled for next month.',
    content: 'Individual performance review meetings will be conducted in February. Your manager will schedule a convenient time slot.',
    createdBy: 3,
    createdByName: 'Admin User',
    createdByRole: 'SUPER_ADMIN',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    targetType: 'ADMIN_ONLY',
  },
  {
    id: 5,
    title: 'Important Update for John Doe',
    description: 'This message is for specific team members only.',
    content: 'John and Alice, please check your project assignments in the system. The updates have been made and are effective immediately.',
    createdBy: 2,
    createdByName: 'Jane Smith',
    createdByRole: 'LAB_ADMIN',
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
    priority: 'MEDIUM',
    labId: 1,
    status: 'ACTIVE',
    targetType: 'SPECIFIC_MEMBERS',
    targetMemberIds: [1, 2],
  },
];

// ============================================
// Mock Shifts Data
// ============================================
export const mockShifts = [
  {
    id: 1,
    name: 'Morning Shift',
    type: 'MORNING' as const,
    startTime: '06:00',
    endTime: '14:00',
    breakDuration: 60,
    totalWorkHours: 8,
    description: 'Early morning shift',
    status: 'ACTIVE' as const,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Afternoon Shift',
    type: 'AFTERNOON' as const,
    startTime: '14:00',
    endTime: '22:00',
    breakDuration: 60,
    totalWorkHours: 8,
    description: 'Afternoon shift',
    status: 'ACTIVE' as const,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Evening Shift',
    type: 'EVENING' as const,
    startTime: '17:00',
    endTime: '23:00',
    breakDuration: 30,
    totalWorkHours: 6,
    description: 'Evening shift',
    status: 'ACTIVE' as const,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================
// Mock Roster Assignments
// ============================================
export const mockRosterAssignments = [
  {
    id: 1,
    labMemberId: 1,
    labMemberName: 'John Doe',
    shiftId: 1,
    shiftName: 'Morning Shift',
    weekStartDate: '2024-01-22',
    weekEndDate: '2024-01-28',
    assignedBy: 2,
    assignedByName: 'Jane Smith',
    status: 'CONFIRMED' as const,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 2,
    labMemberId: 2,
    labMemberName: 'Alice Johnson',
    shiftId: 2,
    shiftName: 'Afternoon Shift',
    weekStartDate: '2024-01-22',
    weekEndDate: '2024-01-28',
    assignedBy: 2,
    assignedByName: 'Jane Smith',
    status: 'ASSIGNED' as const,
    createdAt: '2024-01-20T10:15:00Z',
    updatedAt: '2024-01-20T10:15:00Z',
  },
  {
    id: 3,
    labMemberId: 3,
    labMemberName: 'Bob Wilson',
    shiftId: 1,
    shiftName: 'Morning Shift',
    weekStartDate: '2024-01-22',
    weekEndDate: '2024-01-28',
    assignedBy: 2,
    assignedByName: 'Jane Smith',
    status: 'CONFIRMED' as const,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
];

// ============================================
// Mock Overtime Requests
// ============================================
export const mockOvertimeRequests = [
  {
    id: 1,
    labMemberId: 1,
    labMemberName: 'John Doe',
    date: '2024-01-25',
    overtimeHours: 2,
    reason: 'Project deadline',
    status: 'APPROVED' as const,
    approvedBy: 2,
    approvedByName: 'Jane Smith',
    approvalDate: '2024-01-25T18:00:00Z',
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T18:00:00Z',
  },
  {
    id: 2,
    labMemberId: 2,
    labMemberName: 'Alice Johnson',
    date: '2024-01-26',
    overtimeHours: 3,
    reason: 'Critical bug fix',
    status: 'PENDING' as const,
    approvedBy: 0,
    approvedByName: '',
    approvalDate: '',
    createdAt: '2024-01-26T10:00:00Z',
    updatedAt: '2024-01-26T10:00:00Z',
  },
  {
    id: 3,
    labMemberId: 3,
    labMemberName: 'Bob Wilson',
    date: '2024-01-24',
    overtimeHours: 1.5,
    reason: 'Client meeting',
    status: 'APPROVED' as const,
    approvedBy: 2,
    approvedByName: 'Jane Smith',
    approvalDate: '2024-01-24T17:00:00Z',
    createdAt: '2024-01-24T14:00:00Z',
    updatedAt: '2024-01-24T17:00:00Z',
  },
];

// ============================================
// Mock Work Hours
// ============================================
export const mockWorkHours = [
  {
    id: 1,
    labMemberId: 1,
    labMemberName: 'John Doe',
    month: 1,
    year: 2024,
    totalWorkHours: 168,
    overtimeHours: 6,
    extraHours: 2,
    standardWorkHours: 160,
  },
  {
    id: 2,
    labMemberId: 2,
    labMemberName: 'Alice Johnson',
    month: 1,
    year: 2024,
    totalWorkHours: 165,
    overtimeHours: 5,
    extraHours: 0,
    standardWorkHours: 160,
  },
  {
    id: 3,
    labMemberId: 3,
    labMemberName: 'Bob Wilson',
    month: 1,
    year: 2024,
    totalWorkHours: 162,
    overtimeHours: 2,
    extraHours: 0,
    standardWorkHours: 160,
  },
];

// ============================================
// Mock Payroll Deductions
// ============================================
export const mockDeductions = [
  {
    id: 1,
    name: 'Provident Fund',
    type: 'PF' as const,
    percentage: 12,
    isApplicableToAll: true,
    description: 'Employee contribution to PF',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'ESI',
    type: 'ESI' as const,
    percentage: 0.75,
    isApplicableToAll: true,
    description: 'Employee State Insurance',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Professional Tax',
    type: 'OTHER' as const,
    amount: 200,
    isApplicableToAll: true,
    description: 'State professional tax',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================
// Mock Payroll Summary
// ============================================
export const mockPayrollSummary = {
  id: 1,
  month: 1,
  year: 2024,
  totalEmployees: 25,
  totalBaseSalary: 750000,
  totalOvertime: 45000,
  totalIncentives: 15000,
  totalDeductions: 95000,
  totalNetPayroll: 715000,
  processedCount: 24,
  pendingCount: 1,
  generatedAt: '2024-01-31T18:00:00Z',
};
