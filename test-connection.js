const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration in .env.local');
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log(`🌐 Connecting to: ${supabaseUrl}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔍 Testing connection...');
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('This might be due to RLS policies or network issues');
    } else {
      console.log('✅ Connection successful!');
      console.log(`📊 Found ${data?.length || 0} user records`);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }

  console.log('\n🎉 Test completed!');
}

testConnection();