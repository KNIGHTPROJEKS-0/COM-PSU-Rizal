#!/bin/bash

# Jenkins Pipeline Setup Script for COM-PSU-Rizal

# Variables
JENKINS_URL="http://localhost:8080"
JENKINS_CLI_JAR="$HOME/bin/jenkins-cli.jar"
JOB_NAME="com-psu-rizal"
JOB_CONFIG="job-config.xml"

# Check if Jenkins CLI jar exists
if [ ! -f "$JENKINS_CLI_JAR" ]; then
    echo "Jenkins CLI jar not found at $JENKINS_CLI_JAR"
    echo "Please make sure Jenkins CLI is properly installed"
    exit 1
fi

# Check if job config exists
if [ ! -f "$JOB_CONFIG" ]; then
    echo "Job configuration file not found at $JOB_CONFIG"
    exit 1
fi

# Prompt for Jenkins credentials
read -p "Jenkins username: " JENKINS_USER
read -s -p "Jenkins API token: " JENKINS_TOKEN
echo

# Test Jenkins connection
echo "Testing Jenkins connection..."
java -jar "$JENKINS_CLI_JAR" -s "$JENKINS_URL" -auth "$JENKINS_USER:$JENKINS_TOKEN" version
if [ $? -ne 0 ]; then
    echo "Failed to connect to Jenkins. Please check your credentials and Jenkins URL."
    exit 1
fi

echo "Connected to Jenkins successfully!"

# Create or update the job
echo "Creating/updating Jenkins job: $JOB_NAME"
java -jar "$JENKINS_CLI_JAR" -s "$JENKINS_URL" -auth "$JENKINS_USER:$JENKINS_TOKEN" create-job "$JOB_NAME" < "$JOB_CONFIG"
if [ $? -ne 0 ]; then
    echo "Failed to create job. Trying to update existing job..."
    java -jar "$JENKINS_CLI_JAR" -s "$JENKINS_URL" -auth "$JENKINS_USER:$JENKINS_TOKEN" update-job "$JOB_NAME" < "$JOB_CONFIG"
    if [ $? -ne 0 ]; then
        echo "Failed to create or update job."
        exit 1
    fi
fi

echo "Job $JOB_NAME created/updated successfully!"

# Build the job
read -p "Do you want to trigger a build now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Triggering build for $JOB_NAME..."
    java -jar "$JENKINS_CLI_JAR" -s "$JENKINS_URL" -auth "$JENKINS_USER:$JENKINS_TOKEN" build "$JOB_NAME" -s -v
    if [ $? -eq 0 ]; then
        echo "Build triggered successfully!"
    else
        echo "Failed to trigger build."
    fi
fi

echo "Setup complete!"