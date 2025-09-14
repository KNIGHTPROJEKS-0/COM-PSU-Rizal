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

async function checkTestUsers() {
  console.log('Checking test users in database...');
  
  const testUsers = [
    'admin@com-psu-rizal.com',
    'user1@com-psu-rizal.com',
    'user2@com-psu-rizal.com'
  ];
  
  try {
    // Check auth users
    console.log('\n--- Checking Auth Users ---');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError.message);
    } else {
      const foundAuthUsers = authUsers.users.filter(user => user.email && testUsers.includes(user.email));
      console.log('Found test auth users:', foundAuthUsers.length);
      foundAuthUsers.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id}, Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'})`);
      });
    }
    
    // Check public users table
    console.log('\n--- Checking Public Users Table ---');
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('*')
      .in('email', testUsers);
    
    if (publicError) {
      console.error('Error fetching public users:', publicError.message);
    } else {
      console.log('Found test public users:', publicUsers.length);
      publicUsers.forEach(user => {
        console.log(`- ${user.email} (ID: ${user.id}, Role: ${user.role}, Name: ${user.first_name} ${user.last_name})`);
      });
    }
    
    // If users don't exist, let's try to create them
    if (publicUsers && publicUsers.length === 0) {
      console.log('\n--- No test users found, attempting to create them ---');
      // We'll need service role key for this
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
      if (serviceKey) {
        const serviceClient = createClient(supabaseUrl, serviceKey);
        
        // Create auth users
        for (const userData of [
          { email: 'admin@com-psu-rizal.com', password: 'admin', role: 'admin', firstName: 'Admin', lastName: 'User' },
          { email: 'user1@com-psu-rizal.com', password: 'user1', role: 'student', firstName: 'User', lastName: 'One' },
          { email: 'user2@com-psu-rizal.com', password: 'user2', role: 'student', firstName: 'User', lastName: 'Two' }
        ]) {
          try {
            const { data, error } = await serviceClient.auth.signUp({
              email: userData.email,
              password: userData.password,
              options: {
                data: {
                  first_name: userData.firstName,
                  last_name: userData.lastName,
                  role: userData.role
                }
              }
            });
            
            if (error) {
              console.error(`Error creating auth user ${userData.email}:`, error.message);
            } else {
              console.log(`Created auth user: ${userData.email}`);
              
              // Create public user record
              const { error: insertError } = await serviceClient
                .from('users')
                .insert([
                  {
                    id: data.user?.id,
                    email: userData.email,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    role: userData.role,
                    created_at: new Date().toISOString()
                  }
                ]);
              
              if (insertError) {
                console.error(`Error creating public user record for ${userData.email}:`, insertError.message);
              } else {
                console.log(`Created public user record for: ${userData.email}`);
              }
            }
          } catch (error) {
            console.error(`Error creating user ${userData.email}:`, error);
          }
        }
      } else {
        console.log('Service role key not found, cannot create users');
      }
    }
    
    console.log('\nVerification complete.');
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkTestUsers();