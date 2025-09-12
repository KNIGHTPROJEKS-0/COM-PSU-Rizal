# COM-PSU-Rizal

A real-time video conferencing web application built with Next.js, Tailwind CSS, and WebRTC.

## Features

- High-quality video calls
- Screen sharing
- Real-time chat
- Meeting link generation
- Responsive design
- Secure connections

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
│   ├── meeting/         # Meeting pages
│   ├── page.tsx         # Landing page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/              # UI components from shadcn/ui
│   └── ...              # Custom components
├── public/              # Static assets
└── ...
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.