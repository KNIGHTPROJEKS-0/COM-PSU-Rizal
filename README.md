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
- Responsive design
- Meeting scheduling (planned)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

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
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Academic dashboard with analytics
│   ├── meeting/         # Meeting pages
│   │   ├── new/         # Create new meeting
│   │   ├── join/        # Join existing meeting
│   │   └── [id]/        # Meeting room
│   ├── page.tsx         # Landing page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── auth/            # Authentication components
│   ├── ui/              # UI components from shadcn/ui
│   └── ...              # Custom components
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

### Meeting Management
- Password-protected meetings
- Waiting room functionality
- Meeting scheduling (in development)
- Meeting recording (planned)

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.