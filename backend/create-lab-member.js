const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createLabMember() {
    try {
        const email = 'labmember@attendease.com';
        const password = 'labmember123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword, // Make sure pass is updated if exists
                status: 'ACTIVE'
            },
            create: {
                email,
                password: hashedPassword,
                name: 'Lab Member',
                role: 'EMPLOYEE', // Ensure this matches Role enum
                employeeId: 'LABMEM001',
                designation: 'Lab Member',
                status: 'ACTIVE',
                dateOfJoining: new Date(),
                baseSalary: 50000,
            },
        });

        console.log(`✅ Lab Member created/updated successfully!`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Password: ${password}`);
        console.log(`🆔 Role: ${user.role}`);

    } catch (e) {
        console.error('Error creating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

createLabMember();
