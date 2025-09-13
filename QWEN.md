# Qwen Context File

This file contains context information for Qwen's interactions with this project.

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

## Recent Improvements

### UI/UX Enhancements
- Improved text visibility on dark backgrounds in the "Start a New Meeting" page
- Enhanced color contrast for better accessibility
- Updated text colors for labels, titles, and descriptions
- Created role-based authentication flow with Student/Faculty selection
- Implemented consistent dark theme with proper text visibility and color contrast

### Supabase Integration
- Added Supabase authentication for students and faculty with role-based access control
- Created comprehensive database schema for academic features (users, classes, enrollments, attendance, assignments, submissions, grades)
- Implemented database services for all academic operations
- Set up storage for assignments and backups
- Configured Row Level Security (RLS) policies for data protection
- Implemented SSR (Server-Side Rendering) support with middleware
- Created role-specific dashboards for admin/faculty and student users

### Core Functionality Implementation
- Role-Based Access Control: Students and faculty are redirected to appropriate dashboards
- Academic Features: Class management, enrollment tracking, attendance monitoring, assignment submission/grading
- UI/UX Enhancements: Consistent dark theme with proper text visibility and color contrast
- Responsive Design: Fully responsive layout that works on all device sizes

### Code Structure
- Authentication Service: Complete implementation with sign up, sign in, sign out, and password management
- Database Service: Full CRUD operations for all academic entities
- Context Providers: Proper React context for authentication state management
- Component Library: Reusable UI components following shadcn/ui patterns

### Performance Improvements
- Enabled Turbopack for faster development builds and hot module replacement
- Optimized build process with Next.js 15.2.4

## Qwen's Role

Qwen is an AI programming assistant that helps with:
- Code understanding and explanation
- Bug fixing and debugging
- Feature implementation
- Code refactoring and optimization
- Documentation writing
- Testing and quality assurance

## Usage Instructions

When working with this project, Qwen will:
1. Follow established coding conventions and patterns
2. Maintain existing code style and architecture
3. Ensure all changes are well-tested and functional
4. Provide clear explanations for all modifications
5. Respect project-specific configurations and settings

## Last Updated

Saturday, September 13, 2025