# Jenkins Configuration Summary

## Files Created

1. **Jenkinsfile** - Pipeline definition for the COM-PSU-Rizal project
2. **job-config.xml** - Jenkins job configuration XML file
3. **JENKINS_SETUP.md** - Documentation for Jenkins authentication and setup
4. **setup-jenkins-pipeline.sh** - Automated script to create the Jenkins job

## Next Steps

1. **Set up Jenkins Authentication**:
   - Log in to Jenkins at http://localhost:8080
   - Go to your user profile and generate an API token
   - Note down the token for use with the CLI

2. **Run the Setup Script**:
   ```bash
   ./setup-jenkins-pipeline.sh
   ```
   This script will:
   - Prompt for your Jenkins credentials
   - Test the connection to Jenkins
   - Create or update the Jenkins job
   - Optionally trigger a build

3. **Manual CLI Usage** (if preferred):
   ```bash
   # Create the job
   java -jar ~/bin/jenkins-cli.jar -s http://localhost:8080/ -auth admin:YOUR_API_TOKEN create-job com-psu-rizal < job-config.xml
   
   # Build the job
   java -jar ~/bin/jenkins-cli.jar -s http://localhost:8080/ -auth admin:YOUR_API_TOKEN build com-psu-rizal -s -v
   ```

## Pipeline Stages

The Jenkins pipeline includes the following stages:
1. Checkout - Gets the source code
2. Environment Setup - Verifies Node.js and npm versions
3. Install Dependencies - Installs npm dependencies using `npm ci`
4. Lint - Runs code linting with `npm run lint`
5. Build - Builds the Next.js application with `npm run build`
6. Test - Placeholder for tests (to be implemented)

## Environment Variables

The pipeline is configured to accept the following parameters:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

These can be set in Jenkins when configuring the job or through the build parameters.