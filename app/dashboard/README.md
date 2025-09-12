# Dashboard Structure

This project now includes role-based dashboards for different user types:

## Authentication Flow
1. **Landing Page** (`/`) - Public homepage
2. **Authentication Page** (`/auth`) - Two-column authentication with role selection
3. **Dashboard Redirect** (`/dashboard`) - Redirects users based on their role
4. **Role-based Dashboards**:
   - Admin/Faculty Dashboard (`/dashboard/admin`)
   - Student Dashboard (`/dashboard/student`)

## Authentication Page Features
- Two-column layout:
  - Left column: Role selection (Student vs Faculty)
  - Right column: Authentication forms (Sign In/Sign Up)
- Social login options
- Responsive design
- Role-based registration

## Dashboard Features

### Admin/Faculty Dashboard (`/dashboard/admin`)
- Class management
- Student enrollment tracking
- Assignment creation and grading
- Attendance monitoring
- Analytics and reporting

### Student Dashboard (`/dashboard/student`)
- Class enrollment
- Assignment submission
- Attendance tracking
- Grade viewing
- Class schedule

## Navigation
- Users are automatically redirected to the appropriate dashboard based on their role
- Faculty users are redirected to `/dashboard/admin`
- Student users are redirected to `/dashboard/student`