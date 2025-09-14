# Firebase configuration

This project uses Firebase Web SDK (v10) for optional client features like Analytics.

## Env vars

Copy `.env.local.example` to `.env.local` and fill values from your Firebase project settings (Web app):

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional for Analytics)

## Client initializer

Use `lib/firebaseClient.ts` to get the app and (optionally) Analytics in client components only.

Example:

```tsx
"use client";
import { useEffect } from "react";
import { getFirebaseApp, getFirebaseAnalytics } from "@/lib/firebaseClient";

export default function AnalyticsBoot() {
  useEffect(() => {
    getFirebaseApp();
    getFirebaseAnalytics();
  }, []);
  return null;
}
```

In Next.js App Router, you can include this in `app/layout.tsx` under a client-only wrapper or in a specific page.

## App Hosting notes

- The root `package.json` start script respects PORT and Node engines are set for Firebase App Hosting.
- Ensure env vars are configured in Firebase console → App Hosting → Environment variables (use the NEXT*PUBLIC* keys).

## Troubleshooting

- Analytics only runs in the browser and when supported. The helper guards against SSR.
- If envs are missing, Firebase initializes may fail. Double-check `.env.local` and hosting envs.
