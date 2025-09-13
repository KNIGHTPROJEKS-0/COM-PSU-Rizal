# Jenkins Setup and Pipeline Creation Guide

## Prerequisites
1. Jenkins server running on http://localhost:8080
2. Jenkins CLI jar file available

## Authentication Setup

To use the Jenkins CLI or REST API, you'll need to set up proper authentication:

1. Log in to Jenkins at http://localhost:8080
2. Go to your user profile (top right corner)
3. Click on "Configure"
4. Under "API Token", click "Add new Token"
5. Give it a name (e.g., "CLI Token") and click "Generate"
6. Copy the generated token - this will be used for authentication

## Using Jenkins CLI

Once you have the API token, you can use the Jenkins CLI:

```bash
java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:YOUR_API_TOKEN help
```

## Creating a Pipeline Job via CLI

```bash
java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:YOUR_API_TOKEN create-job com-psu-rizal < job-config.xml
```

## Creating a Pipeline Job via REST API

```bash
curl -X POST 'http://localhost:8080/createItem?name=com-psu-rizal' \
  --header 'Authorization: Basic YOUR_BASE64_ENCODED_CREDENTIALS' \
  --header 'Content-Type: application/xml' \
  --data-binary @job-config.xml
```

To base64 encode your credentials:
```bash
echo -n 'admin:YOUR_API_TOKEN' | base64
```

## Building the Pipeline

Once the job is created, you can trigger a build:

```bash
java -jar jenkins-cli.jar -s http://localhost:8080/ -auth admin:YOUR_API_TOKEN build com-psu-rizal
```