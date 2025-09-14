# COM-PSU-Rizal Monorepo - Innovative Build & Run Workflow

## 🚀 Overview

This monorepo features an innovative initialization script that automates the build and run process for both webapp and electron applications. The script intelligently handles dependency management, parallel processing, health checks, and cross-platform compatibility.

## 📁 Project Structure

```
COM-PSU-Rizal/
├── init.sh                 # Main initialization script
├── monorepo.config         # Configuration file
├── apps/
│   ├── webapp/            # Next.js web application (Port: 3001)
│   └── desktop/           # Electron desktop application (Port: 3002)
├── packages/
│   ├── shared-components/ # Shared React components
│   └── shared-lib/       # Shared utilities and libraries
├── services/
│   └── python/           # Python API services (Port: 8001)
├── integrations/         # Third-party integrations
├── scripts/             # Utility scripts
└── logs/               # Build and runtime logs
```

## ✨ Innovative Features

### 🤖 Intelligent Automation

- **Auto-dependency resolution**: Automatically installs missing dependencies
- **Smart path detection**: Dynamically locates modules and files
- **Environment detection**: Adapts to different operating systems
- **Health monitoring**: Continuous health checks for all services

### ⚡ Performance Optimizations

- **Parallel processing**: Builds multiple services simultaneously
- **Incremental builds**: Only rebuilds when necessary
- **Resource optimization**: Efficient memory and CPU usage
- **Caching**: Intelligent caching of build artifacts

### 🛡️ Reliability Features

- **Error recovery**: Automatic retry mechanisms
- **Process management**: Proper cleanup and signal handling
- **Logging**: Comprehensive logging for debugging
- **Validation**: Pre-flight checks before operations

## 🛠️ Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Python >= 3.8.0
- npm, yarn, or pnpm

### Basic Usage

```bash
# Initialize everything (webapp + electron + python services)
./init.sh all

# Or using npm scripts
npm run init:all

# Start only the webapp
./init.sh webapp
# or
npm run init:webapp

# Start only the electron app
./init.sh electron
# or
npm run init:electron

# Start only python services
./init.sh python
# or
npm run init:python
```

### Advanced Usage

```bash
# Production build
./init.sh -m production all

# Enable parallel processing
./init.sh -p all

# Verbose output
./init.sh -v all

# Clean all artifacts and stop processes
./init.sh clean

# Check service health
./init.sh health

# Show service status
./init.sh status
```

## 📋 Available Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `./init.sh all`      | Build and run all services               |
| `./init.sh webapp`   | Build and run webapp only                |
| `./init.sh electron` | Build and run electron app only          |
| `./init.sh python`   | Start Python services only               |
| `./init.sh clean`    | Clean build artifacts and stop processes |
| `./init.sh health`   | Perform health checks                    |
| `./init.sh status`   | Show status of all services              |

## ⚙️ Configuration

### Environment Variables

| Variable          | Default       | Description             |
| ----------------- | ------------- | ----------------------- |
| `NODE_ENV`        | `development` | Node.js environment     |
| `BUILD_MODE`      | `development` | Build mode              |
| `WEBAPP_PORT`     | `3001`        | WebApp port             |
| `ELECTRON_PORT`   | `3002`        | Electron port           |
| `PYTHON_API_PORT` | `8001`        | Python API port         |
| `PARALLEL_JOBS`   | `auto`        | Number of parallel jobs |

### Configuration File

The `monorepo.config` file contains all path definitions and settings:

```bash
# Project paths
PROJECT_ROOT="/Users/ORDEROFCODE/COM-PSU-Rizal"
WEBAPP_DIR="$PROJECT_ROOT/apps/webapp"
DESKTOP_DIR="$PROJECT_ROOT/apps/desktop"

# Port configuration
WEBAPP_PORT=3001
ELECTRON_PORT=3002
PYTHON_API_PORT=8001
```

## 🔧 How It Works

### 1. Pre-flight Checks

- Validates Node.js and Python versions
- Checks directory structure and permissions
- Verifies required dependencies

### 2. Dependency Management

- Automatically installs missing packages
- Updates dependencies when package.json changes
- Handles cross-platform compatibility

### 3. Parallel Build Process

```
Python Services ──┐
                   ├── Health Checks ──► All Services Ready
WebApp ───────────┘
                   └── Process Management
Electron App ────►
```

### 4. Service Orchestration

- Starts Python API first (dependency for webapp)
- Launches webapp and electron in parallel
- Performs health checks on all services
- Manages process lifecycle

### 5. Error Handling & Recovery

- Automatic retry on failures
- Graceful shutdown on errors
- Comprehensive error logging
- Process cleanup on exit

## 📊 Monitoring & Debugging

### Health Checks

```bash
./init.sh health
```

Checks all services and reports their status.

### Service Status

```bash
./init.sh status
```

Shows PID and status of all running services.

### Logs

All logs are stored in the `logs/` directory:

- `webapp.log` - WebApp logs
- `electron.log` - Electron app logs
- `python.log` - Python API logs
- `build.log` - Build process logs

### Process Management

The script creates PID files in `.pids/` directory for proper process management.

## 🐛 Troubleshooting

### Common Issues

**Port conflicts:**

```bash
# Check what's using the ports
lsof -i :3001
lsof -i :3002
lsof -i :8001

# Kill conflicting processes
./init.sh clean
```

**Permission issues:**

```bash
# Make script executable
chmod +x init.sh

# Fix directory permissions
chmod -R 755 apps/ packages/ services/
```

**Build failures:**

```bash
# Clean and rebuild
./init.sh clean
./init.sh all

# Check logs
tail -f logs/build.log
```

### Debug Mode

```bash
# Enable verbose output
./init.sh -v all

# Check individual service logs
tail -f logs/webapp.log
tail -f logs/electron.log
tail -f logs/python.log
```

## 🚀 Advanced Features

### Custom Configuration

Edit `monorepo.config` to customize:

- Port numbers
- Build commands
- Environment variables
- Health check endpoints

### CI/CD Integration

The script can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Build and Test
  run: |
    ./init.sh -m production all
    ./init.sh health
```

### Docker Integration

For containerized deployments:

```bash
# Build with Docker
docker-compose up --build

# Or use the script with Docker
BUILD_MODE=production ./init.sh all
```

## 📈 Performance Tips

### Parallel Processing

```bash
# Use all available CPU cores
PARALLEL_JOBS=$(nproc) ./init.sh -p all
```

### Development Mode

```bash
# Faster builds for development
NODE_ENV=development ./init.sh all
```

### Production Optimization

```bash
# Optimized production build
NODE_ENV=production BUILD_MODE=production ./init.sh all
```

## 🤝 Contributing

### Adding New Services

1. Add service directory to `services/`
2. Update `monorepo.config` with paths and ports
3. Add build commands and health checks
4. Update the main `init.sh` script

### Extending the Script

The script is modular and can be extended:

- Add new commands in the `case` statement
- Create helper functions for common tasks
- Add new health check endpoints
- Integrate with external services

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section
2. Review the logs in `logs/` directory
3. Run `./init.sh status` for service information
4. Use `./init.sh -v` for verbose output

---

**Happy coding! 🎉**
