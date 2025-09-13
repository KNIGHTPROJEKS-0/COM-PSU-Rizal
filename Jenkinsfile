pipeline {
    agent any
    
    tools {
        nodejs "node"
    }
    
    environment {
        NEXT_PUBLIC_SUPABASE_URL = "${env.NEXT_PUBLIC_SUPABASE_URL}"
        NEXT_PUBLIC_SUPABASE_ANON_KEY = "${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Environment Setup') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                // Add your test commands here
                sh 'echo "Running tests..."'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}