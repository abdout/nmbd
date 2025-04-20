// Database connection check script
// Run with: node scripts/check-db.js

const { PrismaClient } = require('@prisma/client');

async function checkDatabaseConnection() {
  console.log('=== Database Connection Check ===');
  console.log('Date:', new Date().toISOString());
  
  // Check environment variables
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  
  console.log('\n--- Environment Variables ---');
  console.log('DATABASE_URL:', databaseUrl ? '✓ Set' : '✗ Missing');
  console.log('DIRECT_URL:', directUrl ? '✓ Set' : '- Not set (optional)');
  
  if (!databaseUrl) {
    console.error('\n❌ ERROR: DATABASE_URL environment variable is not set.');
    console.log('You must set DATABASE_URL in your .env file. Example:');
    console.log('DATABASE_URL="postgresql://user:password@localhost:5432/dbname"');
    process.exit(1);
  }
  
  // Try to connect to the database
  console.log('\n--- Connection Test ---');
  console.log('Attempting to connect to database...');
  
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database.');
    
    // Test user table
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table accessible. Found ${userCount} users.`);
    } catch (err) {
      console.error('❌ Failed to query user table:', err.message);
    }
    
    // Test post table
    try {
      const postCount = await prisma.post.count();
      console.log(`✅ Post table accessible. Found ${postCount} posts.`);
    } catch (err) {
      console.error('❌ Failed to query post table:', err.message);
    }
    
    // Disconnect
    await prisma.$disconnect();
    console.log('✅ Successfully disconnected from database.');
    
    console.log('\n--- Summary ---');
    console.log('Database connection appears to be working.');
    console.log('If you are still encountering issues in your application,');
    console.log('check the following:');
    console.log('1. Database schema matches your Prisma schema');
    console.log('2. Your application has the correct credentials');
    console.log('3. Database server is accessible from your application');
    
  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to database');
    console.error('Error details:', error.message);
    
    console.log('\n--- Troubleshooting ---');
    if (error.message.includes('connect')) {
      console.log('- Check that your database server is running');
      console.log('- Verify the host and port in your DATABASE_URL');
      console.log('- Ensure your firewall allows connections to the database port');
    } else if (error.message.includes('authentication')) {
      console.log('- Check the username and password in your DATABASE_URL');
      console.log('- Ensure the database user has proper permissions');
    } else if (error.message.includes('does not exist')) {
      console.log('- The database or tables might not exist');
      console.log('- Run `npx prisma migrate dev` to create the schema');
    }
    
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

checkDatabaseConnection().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
}); 