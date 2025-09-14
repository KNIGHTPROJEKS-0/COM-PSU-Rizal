import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
// Note: import analytics APIs dynamically to avoid SSR bundling issues
import type { Analytics } from "firebase/analytics";

// Read from public envs so they bundle on the client
const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

export function getFirebaseApp() {
    if (typeof window === "undefined") return null;
    if (getApps().length) {
        app = getApps()[0]!;
    } else {
        app = initializeApp(config as any);
    }
    return app;
}

export async function getFirebaseAnalytics() {
    if (typeof window === "undefined") return null;
    if (!app) getFirebaseApp();
    if (!app) return null;
    try {
        const { isSupported, getAnalytics } = await import(
            "firebase/analytics"
        );
        if (await isSupported()) {
            analytics = getAnalytics(app!);
            return analytics;
        }
    } catch {
        // analytics not supported (e.g., SSR or unsupported env)
    }
    return null;
}
