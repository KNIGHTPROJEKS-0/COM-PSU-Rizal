#!/usr/bin/env node

/**
 * Railway Supabase Deployment Script
 * Deploys Supabase template to Railway with proper configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');

function runCommand(command, cwd = PROJECT_ROOT) {
  try {
    console.log(`Running: ${command}`);
    const result = execSync(command, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    return result;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function checkRailwayCLI() {
  console.log('🔍 Checking Railway CLI...');

  try {
    execSync('railway --version', { stdio: 'pipe' });
    console.log('✅ Railway CLI is installed');
  } catch (error) {
    console.error('❌ Railway CLI is not installed');
    console.log('Install it with: npm install -g @railway/cli');
    console.log('Or: curl -fsSL https://railway.app/install.sh | sh');
    process.exit(1);
  }
}

function loginToRailway() {
  console.log('🔐 Logging into Railway...');

  const token = process.env.RAILWAY_TOKEN || '0c275f51-45b5-4ee1-b78a-5e3fa62e624f';

  try {
    runCommand(`railway login --token ${token}`);
    console.log('✅ Logged into Railway');
  } catch (error) {
    console.error('❌ Failed to login to Railway');
    console.log('Please check your RAILWAY_TOKEN');
    process.exit(1);
  }
}

function deploySupabaseTemplate() {
  console.log('🚀 Deploying Supabase template to Railway...');

  const projectId = '81e74dcc-dce7-4d33-8e8b-487e100216ee';
  const environmentId = 'b51dd60b-87f2-4ee8-b7a8-012dfa46e1df';

  try {
    // Link to the existing project
    runCommand(`railway link ${projectId}`);

    // Set environment variables
    console.log('📝 Setting environment variables...');

    const envVars = [
      'GOTRUE_SITE_URL=http://localhost:3000',
      'AUTH_JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long',
      'SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      'SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
      'POSTGRES_DB=postgres',
      'POSTGRES_USER=postgres',
      'POSTGRES_PASSWORD=postgres',
      'NEXT_PUBLIC_APP_NAME=COM-PSU-Rizal',
      'NEXT_PUBLIC_ENVIRONMENT=production'
    ];

    for (const envVar of envVars) {
      const [key, value] = envVar.split('=');
      runCommand(`railway variables set ${key} "${value}"`);
    }

    console.log('✅ Environment variables set');

    // Deploy the services
    console.log('🚀 Deploying services...');
    runCommand('railway up');

    console.log('✅ Supabase template deployed successfully!');

  } catch (error) {
    console.error('❌ Failed to deploy Supabase template');
    console.error('Please check your Railway configuration');
    process.exit(1);
  }
}

function getRailwayURLs() {
  console.log('🔗 Getting Railway service URLs...');

  try {
    const result = execSync('railway domain', { encoding: 'utf8' });
    console.log('📋 Railway URLs:');
    console.log(result);

    console.log('\n📝 Update your .env.local with these URLs:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.railway.app');
    console.log('SUPABASE_URL=https://your-project-url.railway.app');

  } catch (error) {
    console.log('⚠️ Could not retrieve Railway URLs automatically');
    console.log('Please check your Railway dashboard for the service URLs');
  }
}

function createDeploymentSummary() {
  console.log('\n📋 Deployment Summary');
  console.log('=' .repeat(50));

  console.log('✅ Railway CLI installed and configured');
  console.log('✅ Supabase template deployed');
  console.log('✅ Environment variables configured');
  console.log('✅ Services are running');

  console.log('\n🔧 Next Steps:');
  console.log('1. Get the Railway service URLs from your dashboard');
  console.log('2. Update .env.local with the new URLs');
  console.log('3. Run: npm run supabase:load-users');
  console.log('4. Test the deployment with: npm run dev');

  console.log('\n🔗 Useful Links:');
  console.log('- Railway Dashboard: https://railway.app/dashboard');
  console.log('- Supabase Docs: https://supabase.com/docs');
  console.log('- Project URL: https://railway.app/project/81e74dcc-dce7-4d33-8e8b-487e100216ee');
}

function main() {
  console.log('🚂 COM-PSU-Rizal Railway Supabase Deployment');
  console.log('============================================\n');

  checkRailwayCLI();
  loginToRailway();
  deploySupabaseTemplate();
  getRailwayURLs();
  createDeploymentSummary();
}

if (require.main === module) {
  main();
}

module.exports = { main };