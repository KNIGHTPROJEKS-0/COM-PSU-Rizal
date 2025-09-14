#!/usr/bin/env node

/**
 * COM-PSU-Rizal Setup Verification Script
 * Verifies the complete Supabase and application setup
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

function checkFileExists(filePath, description) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

function checkEnvironmentVariables() {
  console.log('\n🔍 Checking Environment Variables...');

  const envPath = path.join(PROJECT_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  let allPresent = true;
  for (const varName of requiredVars) {
    const hasVar = envContent.includes(`${varName}=`) &&
                   !envContent.includes(`${varName}=your_`);
    console.log(`${hasVar ? '✅' : '❌'} ${varName}`);
    if (!hasVar) allPresent = false;
  }

  return allPresent;
}

function checkDatabaseMigrations() {
  console.log('\n🔍 Checking Database Migrations...');

  const migrationsDir = path.join(PROJECT_ROOT, 'supabase', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('❌ Migrations directory not found');
    return false;
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`📁 Found ${migrationFiles.length} migration files:`);
  migrationFiles.forEach(file => {
    console.log(`  ✅ ${file}`);
  });

  return migrationFiles.length > 0;
}

function checkSupabaseConfig() {
  console.log('\n🔍 Checking Supabase Configuration...');

  const configPath = path.join(PROJECT_ROOT, 'supabase', 'config.toml');
  if (!fs.existsSync(configPath)) {
    console.log('❌ Supabase config.toml not found');
    return false;
  }

  console.log('✅ Supabase config.toml found');
  return true;
}

function checkPackageJson() {
  console.log('\n🔍 Checking Package Dependencies...');

  const packagePath = path.join(PROJECT_ROOT, 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log('❌ package.json not found');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = [
    '@supabase/supabase-js',
    '@supabase/ssr',
    'next'
  ];

  let allPresent = true;
  for (const dep of requiredDeps) {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`${hasDep ? '✅' : '❌'} ${dep}`);
    if (!hasDep) allPresent = false;
  }

  return allPresent;
}

function checkApplicationFiles() {
  console.log('\n🔍 Checking Application Files...');

  const criticalFiles = [
    ['lib/supabaseClient.ts', 'Supabase client configuration'],
    ['lib/databaseService.ts', 'Database service layer'],
    ['contexts/AuthContext.tsx', 'Authentication context'],
    ['lib/authService.ts', 'Authentication service'],
    ['app/layout.tsx', 'Root layout'],
    ['app/page.tsx', 'Home page'],
    ['supabase/seed.sql', 'Database seed data']
  ];

  let allPresent = true;
  for (const [filePath, description] of criticalFiles) {
    const exists = checkFileExists(filePath, description);
    if (!exists) allPresent = false;
  }

  return allPresent;
}

function generateSetupReport() {
  console.log('\n📋 Setup Verification Report');
  console.log('=' .repeat(50));

  const checks = [
    { name: 'Environment Variables', func: checkEnvironmentVariables },
    { name: 'Database Migrations', func: checkDatabaseMigrations },
    { name: 'Supabase Configuration', func: checkSupabaseConfig },
    { name: 'Package Dependencies', func: checkPackageJson },
    { name: 'Application Files', func: checkApplicationFiles }
  ];

  const results = [];
  for (const check of checks) {
    console.log(`\n🔍 Running ${check.name} check...`);
    const passed = check.func();
    results.push({ name: check.name, passed });
  }

  console.log('\n📊 Summary:');
  console.log('=' .repeat(30));

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });

  console.log(`\n🎯 Overall Status: ${passedCount}/${totalCount} checks passed`);

  if (passedCount === totalCount) {
    console.log('\n🎉 All checks passed! Your setup is ready.');
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open http://localhost:3000');
    console.log('3. Test user registration and login');
    console.log('4. Create test data through the application');
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.');
    console.log('\n🔧 Common fixes:');
    console.log('1. Ensure .env.local has correct Supabase credentials');
    console.log('2. Run: npm install');
    console.log('3. Check that all required files exist');
  }

  return passedCount === totalCount;
}

function main() {
  console.log('🛠️  COM-PSU-Rizal Setup Verification');
  console.log('=====================================\n');

  const success = generateSetupReport();

  if (!success) {
    console.log('\n💡 Need help? Check the setup documentation or run:');
    console.log('   node scripts/setup-supabase.ts');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, generateSetupReport };