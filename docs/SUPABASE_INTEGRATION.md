# Supabase Integration Guide

This document explains how to set up and use the Supabase integration in the COM-PSU-Rizal application.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Note down your Project URL and Anon Key from the project settings

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migrations

1. Copy the SQL from `supabase/migrations/001_initial_schema.sql`
2. Paste and run it in the Supabase SQL editor

### 4. Set up Storage

1. Go to the Storage section in your Supabase dashboard
2. Create a new bucket named "assignments"
3. The RLS policies in the migration will handle access control

## Architecture Overview

The Supabase integration is organized into several layers:

### 1. Supabase Clients (`utils/supabase/`)

- **Server Client** (`utils/supabase/server.ts`): For server-side operations in Server Components
- **Client Client** (`utils/supabase/client.ts`): For client-side operations in Client Components
- **Middleware Client** (`utils/supabase/middleware.ts`): For middleware operations

### 2. Legacy Supabase Client (`lib/supabaseClient.ts`)

- Initializes the Supabase client with your project credentials
- Exports a singleton instance for use throughout the application

### 3. Authentication Service (`lib/authService.ts`)

- Handles all authentication-related operations
- Provides methods for sign up, sign in, sign out, and password management
- Manages user roles (student, faculty, admin)

### 4. Database Service (`lib/supabaseService.ts`)

- Provides methods for all database operations
- Handles classes, enrollments, attendance, assignments, submissions, and grades
- Includes storage operations for file uploads/downloads

### 5. Authentication Context (`contexts/AuthContext.tsx`)

- Provides a React context for authentication state
- Wraps the entire application to make auth state available everywhere
- Handles automatic session restoration

## Key Features

### Authentication

- Email/password authentication for students and faculty
- Role-based access control
- Password reset functionality
- Session management

### Academic Features

- **Users**: Student and faculty accounts with profiles
- **Classes**: Course management with faculty assignment
- **Enrollments**: Student enrollment in classes
- **Attendance**: Attendance tracking for meetings
- **Assignments**: Assignment creation and management
- **Submissions**: Student assignment submission
- **Grades**: Grade recording and management
- **Storage**: File storage for assignments and backups

### Security

- Row Level Security (RLS) policies for data protection
- Role-based access control
- Secure file storage with access restrictions

## Usage Examples

### Server-Side Rendering (SSR)

In Server Components:

```typescript
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("todos").select();

  // Render your page with the data
}
```

### Client-Side Operations

In Client Components:

```typescript
"use client";
import { createClient } from "@/utils/supabase/client";

export default function ClientComponent() {
  const supabase = createClient();

  const fetchData = async () => {
    const { data, error } = await supabase.from("todos").select();
    // Handle the data
  };

  // Rest of your component
}
```

### Middleware

In `middleware.ts`:

```typescript
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await createClient(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Database Operations

### Authentication

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { signIn, signUp, signOut, user } = useAuth();

  const handleSignIn = async () => {
    const { user, error } = await signIn({
      email: "student@example.com",
      password: "password123",
    });
  };
}
```

### Database Operations

```typescript
import { getClasses, createAssignment } from "@/lib/supabaseService";

// Get all classes
const { data: classes, error } = await getClasses();

// Create a new assignment
const { data: assignment, error } = await createAssignment({
  class_id: "class-uuid",
  title: "Math Homework",
  description: "Complete exercises 1-10",
  due_date: "2025-12-31T23:59:59Z",
});
```

## Extending the Integration

To add new features:

1. Update the database schema in `supabase/migrations/001_initial_schema.sql`
2. Add new service methods in `lib/supabaseService.ts`
3. Create new RLS policies for data protection
4. Update the TypeScript interfaces as needed

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure you're using `.env.local` not `.env`
2. **RLS policy violations**: Check that users have the correct roles and permissions
3. **Storage access denied**: Verify the bucket exists and RLS policies are correct

### Debugging

Enable Supabase debugging by adding to your environment:

```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

This will log Supabase operations to the console.
