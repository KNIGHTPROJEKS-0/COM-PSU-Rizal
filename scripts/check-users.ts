import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  process.exit(1);
}

// Create a client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  console.log('Checking users in database...');
  
  try {
    // Check auth users
    console.log('\n--- Auth Users ---');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError.message);
    } else {
      console.log('Total auth users:', authUsers.users.length);
      authUsers.users.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id}, Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'})`);
      });
    }
    
    // Check public users table
    console.log('\n--- Public Users Table ---');
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('*');
    
    if (publicError) {
      console.error('Error fetching public users:', publicError.message);
    } else {
      console.log('Total public users:', publicUsers.length);
      publicUsers.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id}, Role: ${user.role}, Name: ${user.first_name} ${user.last_name})`);
      });
    }
    
    console.log('\nVerification complete.');
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();