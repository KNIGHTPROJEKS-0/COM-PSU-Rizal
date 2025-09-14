#!/usr/bin/env tsx

/**
 * Supabase Configuration Test Script
 * 
 * This script tests the Supabase configuration for both local and cloud setups.
 * It verifies connectivity, checks environment variables, and provides debugging info.
 * 
 * Usage:
 *   npm run test:supabase
 *   or
 *   npx tsx scripts/test-supabase-config.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config()

interface TestResult {
  name: string
  success: boolean
  message: string
  details?: any
}

class SupabaseConfigTester {
  private results: TestResult[] = []

  private addResult(name: string, success: boolean, message: string, details?: any) {
    this.results.push({ name, success, message, details })
  }

  private async testEnvironmentVariables() {
    console.log('\n🔍 Testing Environment Variables...')
    
    const requiredCloudVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]
    
    const optionalVars = [
      'SUPABASE_SERVICE_KEY',
      'USE_LOCAL_SUPABASE',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ]

    // Test required cloud variables
    for (const varName of requiredCloudVars) {
      const value = process.env[varName]
      if (value && value !== 'your_cloud_supabase_url_here' && value !== 'your_cloud_anon_key_here') {
        this.addResult(`ENV: ${varName}`, true, 'Set and configured')
      } else {
        this.addResult(`ENV: ${varName}`, false, 'Missing or using placeholder value')
      }
    }

    // Test optional variables
    for (const varName of optionalVars) {
      const value = process.env[varName]
      if (value) {
        this.addResult(`ENV: ${varName}`, true, `Set: ${varName === 'USE_LOCAL_SUPABASE' ? value : '[HIDDEN]'}`)
      } else {
        this.addResult(`ENV: ${varName}`, true, 'Not set (optional)', { note: 'This is optional' })
      }
    }
  }

  private async testCloudConnection() {
    console.log('\n☁️  Testing Cloud Supabase Connection...')
    
    const cloudUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const cloudKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!cloudUrl || !cloudKey || 
        cloudUrl === 'your_cloud_supabase_url_here' || 
        cloudKey === 'your_cloud_anon_key_here') {
      this.addResult('Cloud Connection', false, 'Cloud credentials not configured')
      return
    }

    try {
      const supabase = createClient(cloudUrl, cloudKey)
      const { data, error } = await supabase.from('users').select('id').limit(1)
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      this.addResult('Cloud Connection', true, 'Successfully connected to cloud Supabase')
    } catch (error) {
      this.addResult('Cloud Connection', false, `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async testLocalConnection() {
    console.log('\n🏠 Testing Local Supabase Connection...')
    
    const localUrl = process.env.SUPABASE_URL || 'http://localhost:54321'
    const localKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

    try {
      const supabase = createClient(localUrl, localKey)
      const { data, error } = await supabase.from('users').select('id').limit(1)
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      this.addResult('Local Connection', true, 'Successfully connected to local Supabase')
    } catch (error) {
      this.addResult('Local Connection', false, `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        note: 'Make sure Docker is running and execute: supabase start'
      })
    }
  }

  private async testConfigurationLogic() {
    console.log('\n⚙️  Testing Configuration Logic...')
    
    const isProduction = process.env.NODE_ENV === 'production'
    const useLocalSupabase = process.env.USE_LOCAL_SUPABASE === 'true'
    
    let expectedConfig: string
    
    if (isProduction) {
      expectedConfig = 'Cloud (Production mode)'
    } else if (useLocalSupabase) {
      expectedConfig = 'Local (Development with USE_LOCAL_SUPABASE=true)'
    } else {
      expectedConfig = 'Cloud (Development default)'
    }
    
    this.addResult('Configuration Logic', true, `Will use: ${expectedConfig}`, {
      NODE_ENV: process.env.NODE_ENV,
      USE_LOCAL_SUPABASE: process.env.USE_LOCAL_SUPABASE,
      isProduction,
      useLocalSupabase
    })
  }

  private printResults() {
    console.log('\n📊 Test Results Summary:')
    console.log('=' .repeat(50))
    
    let passCount = 0
    let failCount = 0
    
    for (const result of this.results) {
      const status = result.success ? '✅' : '❌'
      const color = result.success ? '\x1b[32m' : '\x1b[31m'
      const reset = '\x1b[0m'
      
      console.log(`${status} ${color}${result.name}${reset}: ${result.message}`)
      
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`)
      }
      
      if (result.success) {
        passCount++
      } else {
        failCount++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log(`Total: ${this.results.length} tests | ✅ Passed: ${passCount} | ❌ Failed: ${failCount}`)
    
    if (failCount > 0) {
      console.log('\n🔧 Troubleshooting Tips:')
      console.log('1. Copy .env.example to .env and configure your values')
      console.log('2. For local setup: Install Docker and run "supabase start"')
      console.log('3. For cloud setup: Create a Supabase project and get your credentials')
      console.log('4. Check the .env.example file for detailed setup instructions')
    } else {
      console.log('\n🎉 All tests passed! Your Supabase configuration is working correctly.')
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Supabase Configuration Tests...')
    
    await this.testEnvironmentVariables()
    await this.testConfigurationLogic()
    await this.testCloudConnection()
    await this.testLocalConnection()
    
    this.printResults()
    
    // Exit with error code if any tests failed
    const hasFailures = this.results.some(r => !r.success)
    process.exit(hasFailures ? 1 : 0)
  }
}

// Run the tests
if (require.main === module) {
  const tester = new SupabaseConfigTester()
  tester.runAllTests().catch(console.error)
}

export default SupabaseConfigTester