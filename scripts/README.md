# Scripts Directory

This directory contains organized scripts and resources for the COM-PSU-Rizal project.

## Directory Structure

```text
scripts/
├── README.md                    # This documentation file
├── ai-ml/                       # AI/ML related scripts
│   ├── ai_studio_code.ts       # AI Studio code generation
│   └── gemini.sh               # Gemini AI integration script
├── ci-cd/                       # Continuous Integration/Deployment
│   └── setup-jenkins-pipeline.sh # Jenkins pipeline setup
├── database/                    # Database and Supabase scripts
│   ├── setup-supabase.ts       # Supabase environment setup
│   ├── test-supabase-config.ts # Test Supabase configuration
│   └── test-supabase-connection.ts # Test Supabase connection
├── deployment/                  # Deployment scripts
│   ├── deploy-railway.js       # Railway deployment (Node.js)
│   └── deploy-railway.sh       # Railway deployment (Shell)
├── electron/                    # Electron desktop app files
│   ├── index.html              # Main HTML interface
│   ├── main.js                 # Electron main process
│   ├── preload.js              # Electron preload script
│   └── renderer.js             # Electron renderer process
├── firebase/                    # Firebase related scripts
│   └── get-firebase-sdks.ts    # Firebase SDK management
├── initialization/             # Project initialization scripts
│   └── init.sh                 # Project initialization
├── sql/                        # Database SQL scripts
│   ├── check-and-create-users.sql
│   ├── check-auth-users.sql
│   ├── check-user-roles.sql
│   ├── fix-user-roles.sql
│   └── supabase-user-setup.sql
├── testing/                    # Testing and validation scripts
│   ├── test-auth.ts            # Authentication testing
│   └── test-connection.js      # Connection testing
├── user-management/            # User management scripts
│   ├── check-and-create-test-users.ts
│   ├── check-users.ts
│   ├── create-test-users.ts
│   ├── setup-test-users.sh
│   ├── user-role-diagnostic.sh
│   ├── verify-test-users.ts
│   └── verify-users.sh
└── utility/                    # General utility scripts
    ├── load-remote-users.js   # Remote user loading utility
    ├── sync-electron.sh       # Electron sync utility
    └── verify-setup.js        # Setup verification utility
```

## Categories Overview

### 🤖 AI/ML Scripts (`scripts/ai-ml/`)

Scripts for AI and machine learning integrations:

- **ai_studio_code.ts**: AI-powered code generation and assistance
- **gemini.sh**: Google Gemini AI integration and utilities

### 🔄 CI/CD Scripts (`scripts/ci-cd/`)

Continuous Integration and Deployment automation:

- **setup-jenkins-pipeline.sh**: Configure Jenkins pipelines for automated builds and deployments

### 🗄️ Database Scripts (`scripts/database/`)

Supabase database setup and testing:

- **setup-supabase.ts**: Initialize and configure Supabase environment
- **test-supabase-config.ts**: Validate Supabase configuration settings
- **test-supabase-connection.ts**: Test database connectivity and operations

### 🚀 Deployment Scripts (`scripts/deployment/`)

Application deployment automation:

- **deploy-railway.js**: Node.js script for Railway platform deployment
- **deploy-railway.sh**: Shell script for Railway deployment with CLI commands

### 🖥️ Electron Scripts (`scripts/electron/`)

Desktop application files that sync with `apps/desktop/`:

- **index.html**: Main application interface
- **main.js**: Electron main process (corresponds to `apps/desktop/main.js`)
- **preload.js**: Security preload script (corresponds to `apps/desktop/preload.js`)
- **renderer.js**: Renderer process for UI interactions

### 🔥 Firebase Scripts (`scripts/firebase/`)

Firebase integration and SDK management:

- **get-firebase-sdks.ts**: Firebase SDK retrieval and configuration

### 🏁 Initialization Scripts (`scripts/initialization/`)

Project setup and initialization:

- **init.sh**: Comprehensive project initialization and setup

### 📊 SQL Scripts (`scripts/sql/`)

Database SQL scripts for user management:

- **check-and-create-users.sql**: Check existing users and create if needed
- **check-auth-users.sql**: Verify users in authentication system
- **check-user-roles.sql**: Validate user role assignments
- **fix-user-roles.sql**: Correct and update user roles
- **supabase-user-setup.sql**: Complete Supabase user setup

### 🧪 Testing Scripts (`scripts/testing/`)

Application testing and validation:

- **test-auth.ts**: Authentication flow testing
- **test-connection.js**: Network and service connectivity testing

### 👥 User Management Scripts (`scripts/user-management/`)

User creation, verification, and role management:

- **check-and-create-test-users.ts**: Test user management operations
- **check-users.ts**: User verification and status checking
- **create-test-users.ts**: Test user creation utilities
- **setup-test-users.sh**: Automated test user setup
- **user-role-diagnostic.sh**: User role diagnostics and troubleshooting
- **verify-test-users.ts**: Test user verification
- **verify-users.sh**: User verification and validation

### 🔧 Utility Scripts (`scripts/utility/`)

General-purpose utilities and helpers:

- **load-remote-users.js**: Remote user data loading utilities
- **sync-electron.sh**: Synchronize Electron files with main desktop app
- **verify-setup.js**: Setup verification and validation

## Usage Guidelines

### Running Scripts

Most scripts can be executed from the project root:

```bash
# Database setup
node scripts/database/setup-supabase.ts

# Deployment
./scripts/deployment/deploy-railway.sh

# User management
./scripts/user-management/setup-test-users.sh

# Testing
node scripts/testing/test-auth.ts
```

### Path References

All scripts are designed to work from the project root directory. Relative paths in scripts use `../` to reference the project root when needed.

### Synchronization

The `scripts/electron/` directory is kept in sync with `apps/desktop/` using:

```bash
./scripts/utility/sync-electron.sh
```

## Development Notes

- Scripts are organized by function for easy discovery and maintenance
- Each category has a clear purpose and contains related functionality
- Cross-category dependencies are minimized where possible
- Documentation is maintained in this README for all scripts

## Electron Files (`scripts/electron/`)

Desktop application files that sync with the main Electron app in `apps/desktop/`:

- `index.html` - Main application interface
- `main.js` - Electron main process (corresponds to `apps/desktop/main.js`)
- `preload.js` - Preload script for security (corresponds to `apps/desktop/preload.js`)
- `renderer.js` - Renderer process script

## Synchronization

The `scripts/electron/` directory is designed to sync with the original source in `apps/desktop/`. Files in this directory should be kept in sync with their counterparts in the main desktop application.

### Sync Process

1. **Source of Truth**: `apps/desktop/` (main Electron app)
2. **Working Copy**: `scripts/electron/` (for development/testing)
3. **Sync Direction**: Changes should flow from `apps/desktop/` → `scripts/electron/`

### Usage

To sync the latest changes from the main desktop app:

```bash
# Copy from main desktop app to scripts
cp apps/desktop/main.js scripts/electron/main.js
cp apps/desktop/preload.js scripts/electron/preload.js
# Add any new files as needed
```

## Development Notes

- The Electron files in `scripts/electron/` are standalone and can be run independently for testing
- SQL scripts should be executed in the Supabase SQL editor or database client
- Keep both directories synchronized to maintain consistency
