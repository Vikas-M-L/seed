import * as path from 'path';
import { importUsers } from './import-users';
import { importAttendance } from './import-attendance';
import { importBiometric } from './import-biometric';

async function migrateAll() {
  console.log('🚀 Starting full data migration...\n');

  const dataDir = path.join(__dirname, '../data');

  try {
    // Step 1: Import Users
    console.log('═══════════════════════════════════════');
    console.log('📋 Step 1: Importing Users');
    console.log('═══════════════════════════════════════\n');
    try {
      const usersFile = path.join(dataDir, 'sample_employees.xlsx');
      await importUsers(usersFile);
    } catch (error: any) {
      console.error('⚠️  Users import failed (file may not exist):', error.message);
      console.log('   You can skip this if users are already in the system');
    }

    // Step 2: Import Attendance
    console.log('\n═══════════════════════════════════════');
    console.log('📋 Step 2: Importing Attendance Records');
    console.log('═══════════════════════════════════════\n');
    try {
      const attendanceFile = path.join(dataDir, 'sample_attendance.xlsx');
      await importAttendance(attendanceFile);
    } catch (error: any) {
      console.error('⚠️  Attendance import failed (file may not exist):', error.message);
    }

    // Step 3: Import Biometric
    console.log('\n═══════════════════════════════════════');
    console.log('📋 Step 3: Importing Biometric Data');
    console.log('═══════════════════════════════════════\n');
    try {
      const biometricFile = path.join(dataDir, 'sample_biometric.xlsx');
      await importBiometric(biometricFile);
    } catch (error: any) {
      console.error('⚠️  Biometric import failed (file may not exist):', error.message);
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Migration completed!');
    console.log('═══════════════════════════════════════\n');

    console.log('📝 Next Steps:');
    console.log('1. Login to the admin panel');
    console.log('2. Go to Admin Panel > Biometric Sync to process biometric logs');
    console.log('3. Go to Admin Panel > Payroll Generation to generate salary slips');
    console.log('4. Review imported data in Reports section\n');
  } catch (error) {
    console.error('\n❌ Fatal error during migration:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  migrateAll()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateAll };
