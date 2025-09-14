# Gemini Context File

This file contains context information for Gemini's interactions with this project. It is a synthesis of information from `README.md` and `QWEN.md`.

## Project Information

This is the root directory of the COM-PSU-Rizal project located at `/Users/ORDEROFCODE/COM-PSU-Rizal`.

## Project Details

This is a real-time video conferencing web application named COM-PSU-Rizal with features like:
- Video calls
- Screen sharing
- Chat functionality
- Meeting links generation
- Academic-focused dashboard with analytics
- Attendance tracking
- Student and class management
- Assignment submission and grading
- Advanced technology integrations (GPU.js, PixiJS, protobuf.js, Turbit)
- Real-time collaboration features
- Jenkins CI/CD pipeline integration
- AI agent integration with Byterover MCP
- A hybrid architecture combining Next.js with Angular-like features.

## Project Structure

This is a monorepo containing the PSU Rizal application with separate webapp and desktop applications.

```
com-psu-rizal-monorepo/
├── apps/
│   ├── webapp/          # Next.js web application (port 3001)
│   └── desktop/         # Electron desktop application (port 3002)
├── packages/
│   ├── shared-components/  # Shared React components
│   └── shared-lib/         # Shared utilities and services
├── scripts/             # Build and deployment scripts
└── supabase/            # Supabase configuration
```

## Core Functionality

### Video Conferencing

- Start instant meetings with random meeting IDs
- Join meetings via links
- Toggle audio/video
- Screen sharing capability
- Real-time chat during meetings
- Participant management
- Password-protected meetings
- Waiting room functionality

### Academic Dashboard

- Student enrollment tracking
- Class management overview
- Attendance analytics
- Performance metrics
- Recent activity feed
- Assignment management
- Role-based access control (Student/Faculty/Admin dashboards)

### Meeting Management

- Password-protected meetings
- Waiting room functionality
- Meeting scheduling (in development)
- Meeting recording (planned)

### Supabase Integration

- Authentication (students, faculty, admin) with role-based access control
- Database for users, classes, enrollments, attendance, assignments, submissions, and grades
- Storage for backups/assignments
- Real-time features
- Server-side rendering (SSR) support with middleware
- Row Level Security (RLS) policies for data protection

## 🚀 Advanced Technology Integrations

### High-Performance Computing

- **GPU.js**: WebGL acceleration for graphics and data processing (10-170x speedup)
- **Turbit**: Multicore parallel processing for CPU-intensive tasks (4-8x speedup)
- **PixiJS**: Advanced 2D graphics with 60fps real-time rendering
- **protobuf.js**: Efficient binary serialization for optimal performance

### Innovative Features

- **Advanced Analytics Dashboard**: Real-time data visualization with GPU acceleration
- **High-Performance Document Processor**: Parallel processing with efficient serialization
- **Real-time Collaboration Hub**: Live messaging with activity visualization
- **Performance Monitoring**: Built-in benchmarking and efficiency tracking

## ⚙️ Hybrid Architecture: Next.js + Angular-like Features

The hybrid architecture integrates Angular-like development patterns into Next.js, providing:

- **Dependency Injection**: Service-based architecture with Inversify
- **Reactive Programming**: RxJS for data flow management
- **Form Management**: Angular-like form controls and validation
- **Data Transformation**: Pipe system for data manipulation
- **Component Directives**: Structural and attribute directives
- **Advanced Routing**: Route guards, resolvers, and navigation
- **State Management**: Observable-based state with MobX
- **Lifecycle Hooks**: Component lifecycle management
- **Type Safety**: Full TypeScript support

## 🤝 Real-time Collaboration Features

### LiveMeet Integration

The application integrates with the external LiveMeet project for video conferencing:

- Uses LiveMeet's WebSocket server for real-time communication
- Incorporates LiveMeet's WebRTC implementation for video/audio
- Leverages LiveMeet's database schema for meeting data

## 🔄 CI/CD Pipeline with Jenkins

A Jenkins pipeline is configured for CI/CD with stages for checkout, environment setup, dependency installation, linting, building, and testing.

## 🤖 AI Agent Integration

### Byterover MCP Server Tools Reference

This project includes integration with Byterover MCP server tools for AI capabilities, including onboarding and planning workflows, knowledge retrieval and storage, and module management.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

1. Install all dependencies:

```bash
npm run install:all
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Create a `.env.local` file in the root directory with your Supabase URL and keys.
3. Run the database migrations from `supabase/migrations/` in your Supabase SQL editor.

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Flow

- **Role-Based Dashboards**: Users are redirected to `/dashboard/admin` or `/dashboard/student` based on their role (`faculty`, `admin`, or `student`).
- **Access Control**: Dashboards have role-based access control to prevent unauthorized access.
- **Test Credentials**:
    - Admin: `admin@com-psu-rizal.com` / `admin123`
    - Student 1: `user1@com-psu-rizal.com` / `user123`
    - Student 2: `user2@com-psu-rizal.com` / `user456`

## Gemini's Role

Gemini is an AI programming assistant that helps with:
- Code understanding and explanation
- Bug fixing and debugging
- Feature implementation
- Code refactoring and optimization
- Documentation writing
- Testing and quality assurance
- AI agent integration and management
- CI/CD pipeline configuration
- Advanced technology integration

When working with this project, Gemini will:
1. Follow established coding conventions and patterns
2. Maintain existing code style and architecture
3. Ensure all changes are well-tested and functional
4. Provide clear explanations for all modifications
5. Respect project-specific configurations and settings
6. Utilize integrated advanced technologies appropriately
7. Follow AI agent integration best practices
8. Maintain CI/CD pipeline compatibility

## Last Updated

Sunday, September 14, 2025
