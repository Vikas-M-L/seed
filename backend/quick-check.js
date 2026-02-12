const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickCheck() {
    try {
        console.log('\n📊 DATABASE EMPTY CHECK:\n');
        
        const counts = {
            'Users': await prisma.user.count(),
            'Attendance': await prisma.attendance.count(),
            'Biometric Logs': await prisma.biometricLog.count(),
            'Holidays': await prisma.holiday.count(),
            'Leave Applications': await prisma.leaveApplication.count(),
            'Leave Balances': await prisma.leaveBalance.count(),
            'Payroll': await prisma.payroll.count(),
            'Announcements': await prisma.announcement.count(),
            'Announcement Reads': await prisma.announcementRead.count(),
        };
        
        let emptyTables = [];
        
        Object.entries(counts).forEach(([name, count]) => {
            const status = count === 0 ? '⚠️  EMPTY' : '✅';
            console.log(`${status} ${name}: ${count.toLocaleString()} records`);
            if (count === 0) {
                emptyTables.push(name);
            }
        });
        
        console.log('\n' + '='.repeat(50));
        
        if (emptyTables.length > 0) {
            console.log(`\n⚠️  EMPTY TABLES (${emptyTables.length}):`);
            emptyTables.forEach(table => console.log(`   - ${table}`));
        } else {
            console.log('\n✅ ALL TABLES HAVE DATA!');
        }
        
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        console.log(`\n📈 Total records: ${total.toLocaleString()}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

quickCheck();
