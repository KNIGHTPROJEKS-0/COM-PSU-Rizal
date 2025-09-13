import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Key. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment variables.');
  process.exit(1);
}

// Create a service client with full access
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

async function verifyTestUsers() {
  console.log('Verifying test users in database...');
  
  try {
    // Check if users exist in auth.users table
    const { data: authUsers, error: authError } = await serviceClient.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError.message);
      return;
    }
    
    console.log('\nAuth Users:');
    const testEmails = ['admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com'];
    const foundUsers = authUsers.users.filter(user => user.email && testEmails.includes(user.email));
    
    foundUsers.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`);
    });
    
    // Check if users exist in public.users table
    const { data: publicUsers, error: publicError } = await serviceClient
      .from('users')
      .select('*')
      .in('email', testEmails);
    
    if (publicError) {
      console.error('Error fetching public users:', publicError.message);
      return;
    }
    
    console.log('\nPublic Users Table:');
    publicUsers.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id}, Role: ${user.role}, Name: ${user.first_name} ${user.last_name})`);
    });
    
    console.log('\nVerification complete.');
  } catch (error) {
    console.error('Error verifying test users:', error);
  }
}

verifyTestUsers();