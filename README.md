# COM-PSU-Rizal

A real-time video conferencing web application built with Next.js, Tailwind CSS, and WebRTC, specifically designed for academic communities.

## Features

- High-quality video calls
- Screen sharing
- Real-time chat
- Meeting link generation
- Secure connections with password protection and waiting rooms
- Academic dashboard with analytics
- Attendance tracking
- Student and class management
- Assignment submission and grading
- Responsive design
- Meeting scheduling (planned)
- Role-based access control (Student/Faculty)
- Server-side rendering (SSR) with Supabase

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Copy your Supabase URL and Anon Key from the project settings
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the database migrations from `supabase/migrations/` in your Supabase SQL editor
5. Set up the storage bucket for assignments in the Supabase dashboard

For detailed instructions, see [Supabase Integration Guide](docs/SUPABASE_INTEGRATION.md).

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── auth/            # Authentication pages with role selection
│   ├── dashboard/       # Academic dashboard with analytics
│   │   ├── admin/       # Admin dashboard for faculty
│   │   ├── student/     # Student dashboard
│   │   └── README.md    # Dashboard documentation
│   ├── meeting/         # Meeting pages
│   │   ├── new/         # Create new meeting
│   │   ├── join/        # Join existing meeting
│   │   └── [id]/        # Meeting room
│   ├── page.tsx         # Landing page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── ui/              # UI components from shadcn/ui
│   └── ...              # Custom components
├── contexts/            # React context providers
├── docs/                # Documentation
├── lib/                 # Utility functions and service integrations
├── supabase/            # Supabase migrations and configuration
├── utils/               # Utility functions
│   └── supabase/        # Supabase client configurations
├── public/              # Static assets
└── ...
```

## Core Functionality

### Video Conferencing
- Start instant meetings with random meeting IDs
- Join meetings via links
- Toggle audio/video
- Screen sharing capability
- Real-time chat during meetings
- Participant management

### Academic Dashboard
- Student enrollment tracking
- Class management overview
- Attendance analytics
- Performance metrics
- Recent activity feed
- Assignment management
- Role-based access control (Student/Faculty dashboards)

### Meeting Management
- Password-protected meetings
- Waiting room functionality
- Meeting scheduling (in development)
- Meeting recording (planned)

### Supabase Integration
- Authentication (students, faculty) with role-based access control
- Database for users, classes, enrollments, attendance, assignments, submissions, and grades
- Storage for backups/assignments
- Real-time features
- Server-side rendering (SSR) support with middleware
- Row Level Security (RLS) policies for data protection

## Recent Improvements

### UI/UX Enhancements
- Improved text visibility on dark backgrounds in the "Start a New Meeting" page
- Enhanced color contrast for better accessibility
- Updated text colors for labels, titles, and descriptions
- Created a new two-column authentication page with role selection
- Implemented role-specific dashboards for admin/faculty and student users
- Added consistent dark theme with proper text visibility and color contrast

### Supabase Integration
- Added Supabase authentication for students and faculty with role-based access control
- Created comprehensive database schema for academic features (users, classes, enrollments, attendance, assignments, submissions, grades)
- Implemented database services for all academic operations
- Set up storage for assignments and backups
- Configured Row Level Security (RLS) policies for data protection
- Implemented SSR support with middleware
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

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)
- [Supabase Documentation](https://supabase.com/docs)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.