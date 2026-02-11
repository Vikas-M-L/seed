const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLabMembers() {
    try {
        const members = await prisma.user.findMany({
            where: {
                OR: [
                    { role: 'LAB_MEMBER' },
                    { role: 'EMPLOYEE' }
                ]
            },
            take: 5
        });

        console.log('Found ' + members.length + ' lab members/employees:');
        members.forEach(m => console.log(`- ${m.email} (${m.role})`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLabMembers();
