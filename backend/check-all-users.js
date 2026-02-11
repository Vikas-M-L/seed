const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllUsers() {
    try {
        const users = await prisma.user.findMany({
            take: 10,
            select: {
                email: true,
                role: true
            }
        });

        console.log('Sample Users found:');
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));

        const labMem = await prisma.user.findFirst({
            where: {
                email: 'labmember@attendease.com'
            }
        });

        if (labMem) {
            console.log(`\n\n✅ FOUND SPECIFIC LAB MEMBER: ${labMem.email}`);
        } else {
            console.log(`\n\n❌ Lab member 'labmember@attendease.com' NOT FOUND.`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkAllUsers();
