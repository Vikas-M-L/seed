const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetPasswords() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const labMemberPass = await bcrypt.hash('labmember123', 10);

        // 1. Reset password for citseed281@attendease.com
        const user1 = await prisma.user.upsert({
            where: { email: 'citseed281@attendease.com' },
            update: {
                password: hashedPassword,
                status: 'ACTIVE'
            },
            create: {
                email: 'citseed281@attendease.com',
                password: hashedPassword,
                name: 'Employee 281',
                role: 'EMPLOYEE',
                employeeId: 'EMP281',
                designation: 'Employee',
                status: 'ACTIVE',
                dateOfJoining: new Date(),
                baseSalary: 50000,
            }
        });
        console.log(`✅ Reset password for ${user1.email}`);
        console.log(`   New Password: password123`);

        // 2. Ensure labmember@attendease.com exists
        const user2 = await prisma.user.upsert({
            where: { email: 'labmember@attendease.com' },
            update: {
                password: labMemberPass,
                status: 'ACTIVE'
            },
            create: {
                email: 'labmember@attendease.com',
                password: labMemberPass,
                name: 'Lab Member',
                role: 'EMPLOYEE',
                employeeId: 'LABMEM001',
                designation: 'Lab Member',
                status: 'ACTIVE',
                dateOfJoining: new Date(),
                baseSalary: 50000,
            }
        });

        console.log(`✅ Created/Updated ${user2.email}`);
        console.log(`   Password: labmember123`);

    } catch (e) {
        console.error('Error resetting passwords:', e);
    } finally {
        await prisma.$disconnect();
    }
}

resetPasswords();
