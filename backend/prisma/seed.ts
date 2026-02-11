import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default super admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@attendease.com' },
    update: {},
    create: {
      employeeId: 'CITADMIN001',
      employeeNumber: 1,
      name: 'Super Admin',
      email: 'admin@attendease.com',
      passwordHash: hashedPassword,
      designation: 'Administrator',
      role: 'SUPER_ADMIN',
      dateOfJoining: new Date('2026-01-01'),
      baseSalary: 50000,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created super admin:', superAdmin.email);

  // Create Lab Admin user
  const labAdminPassword = await bcrypt.hash('labadmin123', 10);
  const labAdmin = await prisma.user.upsert({
    where: { email: 'labadmin@attendease.com' },
    update: {},
    create: {
      employeeId: 'CITADMIN002',
      employeeNumber: 2,
      name: 'Lab Admin',
      email: 'labadmin@attendease.com',
      passwordHash: labAdminPassword,
      designation: 'Lab Administrator',
      role: 'LAB_ADMIN',
      dateOfJoining: new Date('2026-01-01'),
      baseSalary: 40000,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created lab admin:', labAdmin.email);

  // Create Lab Member user
  const labMemberPassword = await bcrypt.hash('labmember123', 10);
  const labMember = await prisma.user.upsert({
    where: { email: 'labmember@attendease.com' },
    update: {},
    create: {
      employeeId: 'CITMEM001',
      employeeNumber: 3,
      name: 'Lab Member',
      email: 'labmember@attendease.com',
      passwordHash: labMemberPassword,
      designation: 'Research Assistant',
      role: 'EMPLOYEE',
      dateOfJoining: new Date('2026-01-01'),
      baseSalary: 30000,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created lab member:', labMember.email);

  // Create holidays for 2026
  const holidays = [
    { date: new Date('2026-01-26'), name: 'Republic Day', description: 'National Holiday' },
    { date: new Date('2026-03-08'), name: 'Maha Shivaratri', description: 'Hindu Festival' },
    { date: new Date('2026-03-25'), name: 'Holi', description: 'Festival of Colors' },
    { date: new Date('2026-04-02'), name: 'Good Friday', description: 'Christian Holiday' },
    { date: new Date('2026-04-10'), name: 'Ramadan', description: 'Islamic Festival' },
    { date: new Date('2026-04-14'), name: 'Ugadi', description: 'Kannada New Year' },
    { date: new Date('2026-05-01'), name: 'May Day', description: 'Workers Day' },
    { date: new Date('2026-08-15'), name: 'Independence Day', description: 'National Holiday' },
    { date: new Date('2026-08-26'), name: 'Janmashtami', description: 'Hindu Festival' },
    { date: new Date('2026-10-02'), name: 'Gandhi Jayanti', description: 'National Holiday' },
    { date: new Date('2026-10-24'), name: 'Dussehra', description: 'Hindu Festival' },
    { date: new Date('2026-11-13'), name: 'Diwali', description: 'Festival of Lights' },
    { date: new Date('2026-12-25'), name: 'Christmas', description: 'Christian Holiday' },
  ];

  for (const holiday of holidays) {
    await prisma.holiday.upsert({
      where: { date: holiday.date },
      update: {},
      create: holiday,
    });
  }

  console.log(`✅ Created ${holidays.length} holidays for 2026`);

  // Create initial leave balance for super admin (2026)
  await prisma.leaveBalance.upsert({
    where: {
      userId_year: {
        userId: superAdmin.id,
        year: 2026,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      year: 2026,
      casualLeaveTotal: 12,
      casualLeaveUsed: 0,
      casualLeavePending: 0,
      casualLeaveAvailable: 12,
    },
  });

  console.log('✅ Created leave balance for super admin');

  // Create a sample announcement
  await prisma.announcement.create({
    data: {
      title: 'Welcome to Attend Ease!',
      content: 'The new automated attendance and payroll system is now live. You can now view your daily attendance, apply for leaves, and download salary slips online.',
      priority: 'HIGH',
      isPinned: true,
      isActive: true,
      targetAudience: 'ALL',
      createdBy: superAdmin.id,
    },
  });

  console.log('✅ Created welcome announcement');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Login Credentials:');
  console.log('\n   Super Admin:');
  console.log('   Email: admin@attendease.com');
  console.log('   Password: admin123');
  console.log('\n   Lab Admin:');
  console.log('   Email: labadmin@attendease.com');
  console.log('   Password: labadmin123');
  console.log('\n   Lab Member (Employee):');
  console.log('   Email: labmember@attendease.com');
  console.log('   Password: labmember123');
  console.log('\n⚠️  Please change the default passwords after first login!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
