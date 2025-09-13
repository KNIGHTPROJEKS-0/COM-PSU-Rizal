# COM-PSU-Rizal Collaboration Setup

This document explains how to set up and run the collaboration features of the COM-PSU-Rizal platform, including the video conferencing system.

## Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. A Supabase account and project
4. Environment variables set up (see .env.example)

## Setting up Test Users

To create the test users for demonstration purposes:

1. Ensure you have set the `SUPABASE_SERVICE_KEY` in your environment variables
2. Run the test user creation script:

```bash
npx tsx scripts/create-test-users.ts
```

This will create the following users:
- Admin: admin@com-psu-rizal.com / admin
- User 1: user1@com-psu-rizal.com / user1
- User 2: user2@com-psu-rizal.com / user2

## Running the Application with Collaboration Features

To run both the Next.js frontend and the LiveMeet collaboration server:

```bash
npm run dev:collab
```

This will start:
1. The Next.js development server on port 3000
2. The LiveMeet collaboration server on port 5000

## Accessing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Log in with one of the test accounts
3. Navigate to the dashboard and create or join a meeting
4. For video conferencing, the application will connect to the LiveMeet server

## Architecture Overview

The collaboration features are implemented using:
- **Next.js** for the main application frontend
- **LiveMeet** (external) for WebRTC video conferencing
- **Supabase** for user authentication and data storage
- **WebSocket** for real-time communication

## API Integration

The application integrates with the LiveMeet WebSocket server for real-time features:
- Participant tracking
- Chat messaging
- WebRTC signaling (in the full implementation)

## Environment Variables

Make sure to set the following environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Troubleshooting

If you encounter issues:

1. Ensure all environment variables are set correctly
2. Check that both servers are running (Next.js on port 3000, LiveMeet on port 5000)
3. Verify Supabase credentials and database connectivity
4. Check browser console for WebSocket connection errors

For more detailed information about the LiveMeet implementation, check the `externals/LiveMeet` directory.