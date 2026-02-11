const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAttendanceDates() {
    try {
        console.log('🔍 Checking attendance date ranges...\n');

        // Get date range
        const dateRange = await prisma.attendance.aggregate({
            _min: { date: true },
            _max: { date: true },
        });

        console.log('📅 Attendance Date Range:');
        console.log('   Earliest:', dateRange._min.date);
        console.log('   Latest:', dateRange._max.date);
        console.log('');

        // Get count by year-month
        const attendanceByMonth = await prisma.$queryRaw`
      SELECT 
        EXTRACT(YEAR FROM date) as year,
        EXTRACT(MONTH FROM date) as month,
        COUNT(*) as count
      FROM "Attendance"
      GROUP BY year, month
      ORDER BY year DESC, month DESC
      LIMIT 12
    `;

        console.log('📊 Attendance by Month (Last 12 months with data):');
        attendanceByMonth.forEach(row => {
            const monthName = new Date(row.year, row.month - 1).toLocaleString('default', { month: 'long' });
            console.log(`   ${monthName} ${row.year}: ${row.count} records`);
        });

        // Get a sample user's attendance
        const sampleUser = await prisma.user.findFirst({
            where: { role: 'EMPLOYEE' }
        });

        if (sampleUser) {
            const userAttendance = await prisma.attendance.findMany({
                where: { userId: sampleUser.id },
                orderBy: { date: 'desc' },
                take: 5,
            });

            console.log(`\n👤 Sample User (${sampleUser.email}) Recent Attendance:`);
            userAttendance.forEach(att => {
                console.log(`   ${att.date.toISOString().split('T')[0]}: ${att.status}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAttendanceDates();
