# 📊 Import Data from Excel Files

## Current Database Status
- **Total Users:** 3 (1 Super Admin, 1 Lab Admin, 1 Employee)
- **Sample Data Available:** Yes ✅

---

## 📂 Available Sample Files

The `backend/data/` folder contains 3 sample Excel files:

1. **`sample_employees.xlsx`** - Employee/user data
2. **`sample_attendance.xlsx`** - Attendance records
3. **`sample_biometric.xlsx`** - Biometric log data

---

## 🚀 How to Import Data

### Step 1: Import Employees First

**Command:**
```bash
cd d:\inter\prismv2\backend
npm run migrate:users data/sample_employees.xlsx
```

**What it does:**
- Creates user accounts from the Excel file
- Sets default password: `employee123`
- Assigns employee IDs and roles

---

### Step 2: Import Attendance Data

**Command:**
```bash
npm run migrate:attendance data/sample_attendance.xlsx
```

**What it does:**
- Imports attendance records
- Maps statuses (P=Present, A=Absent, HD=Half Day, etc.)
- Links to existing employees by Employee ID

---

### Step 3: Import Biometric Data

**Command:**
```bash
npm run migrate:biometric data/sample_biometric.xlsx
```

**What it does:**
- Imports biometric punch in/out times
- Stores raw data for audit trail
- Marks as unprocessed (needs sync)

---

### Step 4: Process Biometric Logs (Optional)

After importing biometric data, you can process it via:

**Option A: Web UI**
1. Login as Admin
2. Go to Admin Panel
3. Click "Sync Biometric Data"
4. Select date range
5. Click "Process"

**Option B: API Call**
```bash
curl -X POST "http://localhost:3000/api/biometric/sync?date=2025-12-01" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 Excel File Format Requirements

### For Employees File (`sample_employees.xlsx`)

Required columns:
- **Employee ID** - Unique identifier (e.g., CITANN001)
- **Employee Number** - Numeric ID (e.g., 101)
- **Name** - Full name
- **Email** - Unique email address
- **Designation** - Job title (e.g., Annotator, Developer)
- **Date of Joining** - Format: YYYY-MM-DD
- **Base Salary** - Numeric value
- **Role** - EMPLOYEE, LAB_ADMIN, or SUPER_ADMIN

---

### For Attendance File (`sample_attendance.xlsx`)

Required columns:
- **Employee ID** - Must match existing employee
- **Date** - Format: YYYY-MM-DD
- **Status** - P, A, HD, CL, W, H
  - P = Present
  - A = Absent
  - HD = Half Day
  - CL = Casual Leave
  - W = Weekend
  - H = Holiday

Optional columns:
- **In Time** - HH:MM format
- **Out Time** - HH:MM format
- **Duration** - Hours worked
- **Notes** - Additional remarks

---

### For Biometric File (`sample_biometric.xlsx`)

Required columns:
- **Employee ID** - Must match existing employee
- **Date** - Format: YYYY-MM-DD
- **In Time** - First punch in time
- **Out Time** - Last punch out time

Optional columns:
- **Duration** - Total hours
- **In Door** - Entry point
- **Out Door** - Exit point

---

## 🔄 Import All at Once

To import all sample data files in sequence:

```bash
cd d:\inter\prismv2\backend
npm run migrate:all
```

This will:
1. Import users
2. Import attendance
3. Import biometric data
4. Show summary of all imports

---

## ✅ Verify Imported Data

### Option 1: Prisma Studio (Database GUI)
```bash
npm run prisma:studio
```
Opens at http://localhost:5555
- Browse all tables
- View imported records
- Edit data if needed

### Option 2: Web Application
1. Login at http://localhost:5173
2. Go to Reports section
3. View attendance records
4. Check employee list

### Option 3: Database Query
```bash
# Count users
$env:PGPASSWORD='Vikas'; psql -U postgres -d attendease -c "SELECT COUNT(*) FROM users;"

# Count attendance records
$env:PGPASSWORD='Vikas'; psql -U postgres -d attendease -c "SELECT COUNT(*) FROM attendance;"

# Count biometric logs
$env:PGPASSWORD='Vikas'; psql -U postgres -d attendease -c "SELECT COUNT(*) FROM biometric_logs;"
```

---

## 🛠️ Troubleshooting

### Error: "User not found for employee ID: XXX"
**Solution:** Import employees first before importing attendance/biometric data

### Error: "Duplicate email"
**Solution:** Each employee must have a unique email address

### Error: "Invalid date format"
**Solution:** Ensure dates are in YYYY-MM-DD format in Excel

### Error: "File not found"
**Solution:** Check file path - use relative path from backend folder

---

## 💡 Tips

1. **Always import employees first** - Other data depends on existing users
2. **Test with small dataset** - Import a few records first to verify format
3. **Backup database** - Before large imports: `npm run prisma:migrate`
4. **Check console output** - Scripts show progress and errors
5. **Use Prisma Studio** - Great for verifying imported data

---

## 📞 Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Import Users | `npm run migrate:users <file>` | Import employee data |
| Import Attendance | `npm run migrate:attendance <file>` | Import attendance records |
| Import Biometric | `npm run migrate:biometric <file>` | Import biometric logs |
| Import All | `npm run migrate:all` | Import all sample data |
| Create Samples | `npm run migrate:create-samples` | Generate sample Excel files |
| Prisma Studio | `npm run prisma:studio` | Open database GUI |

---

## 🎯 Quick Start

**To import the sample data right now:**

```bash
cd d:\inter\prismv2\backend
npm run migrate:all
```

This will import all sample employees, attendance, and biometric data into your database!

---

*For more details, see `IMPORT_YOUR_DATA.md` and `DATA_MIGRATION_GUIDE.md`*
