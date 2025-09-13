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

interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'faculty' | 'admin';
}

const testUsers: TestUser[] = [
  {
    email: 'admin@com-psu-rizal.com',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'user1@com-psu-rizal.com',
    password: 'user1',
    firstName: 'User',
    lastName: 'One',
    role: 'student'
  },
  {
    email: 'user2@com-psu-rizal.com',
    password: 'user2',
    firstName: 'User',
    lastName: 'Two',
    role: 'student'
  }
];

async function createTestUsers() {
  console.log('Creating test users...');
  
  for (const user of testUsers) {
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await serviceClient.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role
          }
        }
      });

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError.message);
        continue;
      }

      // If signup is successful, create a user record in the database
      if (authData.user) {
        const { error: insertError } = await serviceClient
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: user.email,
              first_name: user.firstName,
              last_name: user.lastName,
              role: user.role,
              created_at: new Date().toISOString()
            }
          ]);

        if (insertError) {
          console.error(`Error creating user record for ${user.email}:`, insertError.message);
          // If we can't create the user record, sign out the user
          await serviceClient.auth.signOut();
          continue;
        }

        console.log(`Successfully created user: ${user.email} (${user.role})`);
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }

  console.log('Test user creation completed.');
}

createTestUsers().catch(console.error);