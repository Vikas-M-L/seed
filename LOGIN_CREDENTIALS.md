# 🔐 Attend Ease - Login Credentials

**Application URL:** http://localhost:5173

---

## Default User Accounts

### 1️⃣ Super Admin
- **Email:** `admin@attendease.com`
- **Password:** `admin123`
- **Role:** SUPER_ADMIN
- **Employee ID:** CITADMIN001
- **Designation:** Administrator
- **Access Level:** Full system access, manage all labs and users

---

### 2️⃣ Lab Admin
- **Email:** `labadmin@attendease.com`
- **Password:** `labadmin123`
- **Role:** LAB_ADMIN
- **Employee ID:** CITADMIN002
- **Designation:** Lab Administrator
- **Access Level:** Manage lab members, attendance, and payroll

---

### 3️⃣ Lab Member (Employee)
- **Email:** `labmember@attendease.com`
- **Password:** `labmember123`
- **Role:** EMPLOYEE
- **Employee ID:** CITMEM001
- **Designation:** Research Assistant
- **Access Level:** View own attendance, apply for leaves, view salary slips

---

## ⚠️ Security Notice

**IMPORTANT:** These are default credentials for testing purposes only. 

**You MUST change these passwords after first login!**

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application interface |
| Backend API | http://localhost:3000/api | REST API endpoints |
| API Documentation | http://localhost:3000/api/docs | Swagger/OpenAPI docs |
| Database | localhost:5432 | PostgreSQL database |

---

## 📊 Role Permissions

### Super Admin Can:
- ✅ Create and manage labs
- ✅ Create and manage all users
- ✅ View all attendance records
- ✅ Generate payroll for all labs
- ✅ Create system-wide announcements
- ✅ Access all reports and analytics

### Lab Admin Can:
- ✅ Manage lab members
- ✅ Mark and edit attendance
- ✅ Approve/reject leave applications
- ✅ Generate payroll for lab members
- ✅ Create lab announcements
- ✅ View lab reports

### Employee Can:
- ✅ View own attendance
- ✅ Apply for leaves
- ✅ View salary slips
- ✅ View announcements
- ✅ Update profile information

---

## 🔄 Quick Start

1. **Open the application:** http://localhost:5173
2. **Choose a role** to test from the credentials above
3. **Login** with the email and password
4. **Explore** the features available for that role

---

*Last Updated: February 9, 2026*
*Database: attendease (PostgreSQL)*
