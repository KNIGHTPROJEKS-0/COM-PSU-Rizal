#!/bin/bash

# ============================================================================
# COM-PSU-Rizal Monorepo Initialization & Build Automation Script
# ============================================================================
# This script provides an innovative workflow for building and running
# the webapp and electron applications with automated dependency management,
# parallel processing, and intelligent path resolution.
# ============================================================================

set -e # Exit on any error

# ============================================================================
# Configuration & Environment Setup
# ============================================================================

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR" && pwd)"
WEBAPP_DIR="$PROJECT_ROOT/apps/webapp"
DESKTOP_DIR="$PROJECT_ROOT/apps/desktop"
PACKAGES_DIR="$PROJECT_ROOT/packages"
SERVICES_DIR="$PROJECT_ROOT/services"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Port configuration
WEBAPP_PORT=3001
ELECTRON_PORT=3002
PYTHON_API_PORT=8001

# Build configuration
NODE_ENV=${NODE_ENV:-development}
BUILD_MODE=${BUILD_MODE:-development}
PARALLEL_JOBS=${PARALLEL_JOBS:-$(nproc 2>/dev/null || echo 4)}

# ============================================================================
# Utility Functions
# ============================================================================

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "${PURPLE}================================================================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================================================================${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if directory exists and is accessible
check_directory() {
    local dir="$1"
    local name="$2"

    if [[ ! -d "$dir" ]]; then
        log_error "Directory $name not found: $dir"
        return 1
    fi

    if [[ ! -r "$dir" ]] || [[ ! -x "$dir" ]]; then
        log_error "Directory $name is not accessible: $dir"
        return 1
    fi

    log_success "Directory $name found: $dir"
    return 0
}

# Check Node.js version
check_nodejs() {
    if ! command_exists node; then
        log_error "Node.js is not installed or not in PATH"
        return 1
    fi

    local node_version=$(node --version | sed 's/v//')
    log_info "Node.js version: $node_version"

    # Check if version is >= 18
    if [[ "$(printf '%s\n' "$node_version" "18.0.0" | sort -V | head -n1)" != "18.0.0" ]]; then
        log_warning "Node.js version $node_version detected. Recommended: >= 18.0.0"
    fi
}

# Check Python version
check_python() {
    if ! command_exists python3; then
        log_error "Python 3 is not installed or not in PATH"
        return 1
    fi

    local python_version=$(python3 --version 2>&1 | sed 's/Python //')
    log_info "Python version: $python_version"
}

# Install Node.js dependencies
install_dependencies() {
    local dir="$1"
    local name="$2"

    log_info "Installing dependencies for $name..."

    if [[ -f "$dir/package.json" ]]; then
        cd "$dir"

        # Check if node_modules exists and is up to date
        if [[ ! -d "node_modules" ]]; then
            log_info "Running npm install in $name..."
            npm install
            log_success "Dependencies installed for $name"
        else
            log_info "Dependencies already up to date for $name"
        fi

        cd "$PROJECT_ROOT"
    else
        log_warning "No package.json found in $name directory"
    fi
}

# Build webapp
build_webapp() {
    log_header "Building WebApp"

    check_directory "$WEBAPP_DIR" "WebApp"

    cd "$WEBAPP_DIR"

    # Install dependencies
    install_dependencies "$WEBAPP_DIR" "WebApp"

    # Set environment variables
    export NODE_ENV="$BUILD_MODE"
    export NEXT_PUBLIC_APP_ENV="$BUILD_MODE"
    export NEXT_PUBLIC_API_URL="http://localhost:$PYTHON_API_PORT"

    # Build the application
    log_info "Building Next.js application..."
    if [[ "$BUILD_MODE" == "production" ]]; then
        npm run build
        log_success "WebApp built successfully for production"
    else
        log_info "Starting development server..."
        npm run dev &
        WEBAPP_PID=$!
        log_success "WebApp development server started (PID: $WEBAPP_PID)"
        echo $WEBAPP_PID >"$PROJECT_ROOT/.webapp.pid"
    fi

    cd "$PROJECT_ROOT"
}

# Build electron app
build_electron() {
    log_header "Building Electron App"

    check_directory "$DESKTOP_DIR" "Desktop App"

    cd "$DESKTOP_DIR"

    # Install dependencies
    install_dependencies "$DESKTOP_DIR" "Desktop App"

    # Set environment variables
    export NODE_ENV="$BUILD_MODE"
    export ELECTRON_IS_DEV=true
    export MAIN_WINDOW_URL="http://localhost:$WEBAPP_PORT"

    # Build the application
    log_info "Building Electron application..."
    if [[ "$BUILD_MODE" == "production" ]]; then
        npm run package
        log_success "Electron app packaged successfully"
    else
        log_info "Starting Electron development mode..."
        npm run dev &
        ELECTRON_PID=$!
        log_success "Electron app started in development mode (PID: $ELECTRON_PID)"
        echo $ELECTRON_PID >"$PROJECT_ROOT/.electron.pid"
    fi

    cd "$PROJECT_ROOT"
}

# Start Python services
start_python_services() {
    log_header "Starting Python Services"

    local python_dir="$SERVICES_DIR/python"

    if [[ -d "$python_dir" ]]; then
        cd "$python_dir"

        # Check if requirements.txt exists
        if [[ -f "requirements.txt" ]]; then
            log_info "Installing Python dependencies..."
            pip3 install -r requirements.txt
        fi

        # Check if main.py exists
        if [[ -f "main.py" ]]; then
            log_info "Starting Python API server..."
            export PYTHONPATH="$python_dir"
            export API_PORT="$PYTHON_API_PORT"

            python3 main.py &
            PYTHON_PID=$!
            log_success "Python API server started (PID: $PYTHON_PID)"
            echo $PYTHON_PID >"$PROJECT_ROOT/.python.pid"
        else
            log_warning "main.py not found in Python services directory"
        fi

        cd "$PROJECT_ROOT"
    else
        log_warning "Python services directory not found: $python_dir"
    fi
}

# Health check function
health_check() {
    local service="$1"
    local url="$2"
    local max_attempts="${3:-30}"
    local attempt=1

    log_info "Performing health check for $service..."

    while [[ $attempt -le $max_attempts ]]; do
        if curl -s --head "$url" >/dev/null 2>&1; then
            log_success "$service is healthy"
            return 0
        fi

        log_info "Waiting for $service... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done

    log_error "$service health check failed after $max_attempts attempts"
    return 1
}

# Clean up function
cleanup() {
    log_info "Cleaning up processes..."

    # Kill webapp process
    if [[ -f "$PROJECT_ROOT/.webapp.pid" ]]; then
        local webapp_pid=$(cat "$PROJECT_ROOT/.webapp.pid")
        if kill -0 $webapp_pid 2>/dev/null; then
            log_info "Stopping WebApp (PID: $webapp_pid)"
            kill $webapp_pid
        fi
        rm -f "$PROJECT_ROOT/.webapp.pid"
    fi

    # Kill electron process
    if [[ -f "$PROJECT_ROOT/.electron.pid" ]]; then
        local electron_pid=$(cat "$PROJECT_ROOT/.electron.pid")
        if kill -0 $electron_pid 2>/dev/null; then
            log_info "Stopping Electron (PID: $electron_pid)"
            kill $electron_pid
        fi
        rm -f "$PROJECT_ROOT/.electron.pid"
    fi

    # Kill python process
    if [[ -f "$PROJECT_ROOT/.python.pid" ]]; then
        local python_pid=$(cat "$PROJECT_ROOT/.python.pid")
        if kill -0 $python_pid 2>/dev/null; then
            log_info "Stopping Python API (PID: $python_pid)"
            kill $python_pid
        fi
        rm -f "$PROJECT_ROOT/.python.pid"
    fi

    log_success "Cleanup completed"
}

# Setup trap for cleanup
trap cleanup EXIT INT TERM

# ============================================================================
# Main Functions
# ============================================================================

# Show usage information
show_usage() {
    cat <<EOF
COM-PSU-Rizal Monorepo Build & Run Script

USAGE:
    $0 [OPTIONS] [COMMAND]

COMMANDS:
    webapp          Build and run the webapp only
    electron        Build and run the electron app only
    python          Start Python services only
    all             Build and run all components (default)
    clean           Clean build artifacts and stop processes
    health          Perform health checks on running services
    status          Show status of all services

OPTIONS:
    -m, --mode MODE     Build mode: development (default) or production
    -p, --parallel      Enable parallel processing
    -v, --verbose       Enable verbose output
    -h, --help          Show this help message

ENVIRONMENT VARIABLES:
    NODE_ENV           Node.js environment (development/production)
    BUILD_MODE         Build mode (development/production)
    WEBAPP_PORT        WebApp port (default: 3001)
    ELECTRON_PORT      Electron port (default: 3002)
    PYTHON_API_PORT    Python API port (default: 8001)
    PARALLEL_JOBS      Number of parallel jobs (default: auto)

EXAMPLES:
    $0 all                    # Build and run everything in development mode
    $0 webapp                 # Build and run webapp only
    $0 -m production all      # Build everything for production
    $0 clean                  # Clean up all processes and artifacts

EOF
}

# Parse command line arguments
parse_args() {
    COMMAND="all"
    VERBOSE=false

    while [[ $# -gt 0 ]]; do
        case $1 in
        -m | --mode)
            BUILD_MODE="$2"
            shift 2
            ;;
        -p | --parallel)
            PARALLEL_JOBS=$(nproc 2>/dev/null || echo 4)
            shift
            ;;
        -v | --verbose)
            VERBOSE=true
            shift
            ;;
        -h | --help)
            show_usage
            exit 0
            ;;
        webapp | electron | python | all | clean | health | status)
            COMMAND="$1"
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
        esac
    done

    # Set verbose output
    if [[ "$VERBOSE" == "true" ]]; then
        set -x
    fi
}

# Main execution function
main() {
    parse_args "$@"

    log_header "COM-PSU-Rizal Monorepo Build & Run Script"
    log_info "Project Root: $PROJECT_ROOT"
    log_info "Build Mode: $BUILD_MODE"
    log_info "Command: $COMMAND"

    # Pre-flight checks
    log_info "Performing pre-flight checks..."

    check_nodejs
    check_python

    # Check required directories
    check_directory "$WEBAPP_DIR" "WebApp"
    check_directory "$DESKTOP_DIR" "Desktop App"
    check_directory "$PACKAGES_DIR" "Packages"
    check_directory "$SERVICES_DIR" "Services"

    case $COMMAND in
    webapp)
        build_webapp
        if [[ "$BUILD_MODE" == "development" ]]; then
            health_check "WebApp" "http://localhost:$WEBAPP_PORT"
            log_success "WebApp is running at http://localhost:$WEBAPP_PORT"
        fi
        ;;
    electron)
        build_electron
        if [[ "$BUILD_MODE" == "development" ]]; then
            log_success "Electron app is running"
        fi
        ;;
    python)
        start_python_services
        if [[ "$BUILD_MODE" == "development" ]]; then
            health_check "Python API" "http://localhost:$PYTHON_API_PORT/docs"
            log_success "Python API is running at http://localhost:$PYTHON_API_PORT"
        fi
        ;;
    all)
        # Start Python services first
        start_python_services

        # Build webapp and electron in parallel if requested
        if [[ $PARALLEL_JOBS -gt 1 ]]; then
            log_info "Starting parallel build process..."

            build_webapp &
            WEBAPP_BUILD_PID=$!

            build_electron &
            ELECTRON_BUILD_PID=$!

            # Wait for both builds to complete
            wait $WEBAPP_BUILD_PID
            wait $ELECTRON_BUILD_PID

            log_success "Parallel build completed"
        else
            build_webapp
            build_electron
        fi

        if [[ "$BUILD_MODE" == "development" ]]; then
            # Perform health checks
            health_check "Python API" "http://localhost:$PYTHON_API_PORT/docs"
            health_check "WebApp" "http://localhost:$WEBAPP_PORT"

            log_success "All services are running:"
            log_success "  - Python API: http://localhost:$PYTHON_API_PORT"
            log_success "  - WebApp: http://localhost:$WEBAPP_PORT"
            log_success "  - Electron App: Running in development mode"
        fi
        ;;
    clean)
        cleanup
        log_info "Cleaning build artifacts..."

        # Clean webapp
        if [[ -d "$WEBAPP_DIR/.next" ]]; then
            rm -rf "$WEBAPP_DIR/.next"
            log_success "Cleaned WebApp build artifacts"
        fi

        # Clean electron
        if [[ -d "$DESKTOP_DIR/dist" ]]; then
            rm -rf "$DESKTOP_DIR/dist"
            log_success "Cleaned Electron build artifacts"
        fi

        # Clean python
        if [[ -d "$SERVICES_DIR/python/__pycache__" ]]; then
            rm -rf "$SERVICES_DIR/python/__pycache__"
            log_success "Cleaned Python cache files"
        fi
        ;;
    health)
        log_info "Performing health checks..."

        # Check Python API
        if curl -s --head "http://localhost:$PYTHON_API_PORT/docs" >/dev/null 2>&1; then
            log_success "Python API is healthy"
        else
            log_warning "Python API is not responding"
        fi

        # Check WebApp
        if curl -s --head "http://localhost:$WEBAPP_PORT" >/dev/null 2>&1; then
            log_success "WebApp is healthy"
        else
            log_warning "WebApp is not responding"
        fi
        ;;
    status)
        log_info "Service Status:"

        # Check Python API
        if [[ -f "$PROJECT_ROOT/.python.pid" ]]; then
            local python_pid=$(cat "$PROJECT_ROOT/.python.pid")
            if kill -0 $python_pid 2>/dev/null; then
                log_success "Python API: Running (PID: $python_pid)"
            else
                log_warning "Python API: Process not found"
            fi
        else
            log_info "Python API: Not started"
        fi

        # Check WebApp
        if [[ -f "$PROJECT_ROOT/.webapp.pid" ]]; then
            local webapp_pid=$(cat "$PROJECT_ROOT/.webapp.pid")
            if kill -0 $webapp_pid 2>/dev/null; then
                log_success "WebApp: Running (PID: $webapp_pid)"
            else
                log_warning "WebApp: Process not found"
            fi
        else
            log_info "WebApp: Not started"
        fi

        # Check Electron
        if [[ -f "$PROJECT_ROOT/.electron.pid" ]]; then
            local electron_pid=$(cat "$PROJECT_ROOT/.electron.pid")
            if kill -0 $electron_pid 2>/dev/null; then
                log_success "Electron: Running (PID: $electron_pid)"
            else
                log_warning "Electron: Process not found"
            fi
        else
            log_info "Electron: Not started"
        fi
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        show_usage
        exit 1
        ;;
    esac

    log_success "Operation completed successfully!"
}

# ============================================================================
# Script Entry Point
# ============================================================================

# Run main function with all arguments
main "$@"
