const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('🔍 Checking Cloud Database Contents...\n');

        // Check Users
        const users = await prisma.user.findMany();
        console.log(`👥 Users: ${users.length} records`);
        if (users.length > 0) {
            console.log('   Sample:', users.slice(0, 3).map(u => `${u.email} (${u.role})`).join(', '));
        }

        // Check Attendance
        const attendance = await prisma.attendance.findMany();
        console.log(`\n📅 Attendance: ${attendance.length} records`);

        // Check BiometricLog
        const biometricLogs = await prisma.biometricLog.findMany();
        console.log(`🔐 Biometric Logs: ${biometricLogs.length} records`);

        // Check Holidays
        const holidays = await prisma.holiday.findMany();
        console.log(`🎉 Holidays: ${holidays.length} records`);
        if (holidays.length > 0) {
            console.log('   Sample:', holidays.slice(0, 2).map(h => h.name).join(', '));
        }

        // Check Leave Applications
        const leaves = await prisma.leaveApplication.findMany();
        console.log(`\n📝 Leave Applications: ${leaves.length} records`);

        // Check Leave Balances
        const leaveBalances = await prisma.leaveBalance.findMany();
        console.log(`💼 Leave Balances: ${leaveBalances.length} records`);

        // Check Payroll
        const payroll = await prisma.payroll.findMany();
        console.log(`💰 Payroll: ${payroll.length} records`);

        // Check Announcements
        const announcements = await prisma.announcement.findMany();
        console.log(`\n📢 Announcements: ${announcements.length} records`);
        if (announcements.length > 0) {
            console.log('   Sample:', announcements.slice(0, 2).map(a => a.title).join(', '));
        }

        console.log('\n' + '='.repeat(50));

        if (users.length === 0) {
            console.log('\n⚠️  DATABASE IS EMPTY!');
            console.log('You need to seed the database with initial data.');
            console.log('\nRun: npm run seed');
        } else {
            console.log('\n✅ Database has data!');
        }

    } catch (error) {
        console.error('❌ Error checking database:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
