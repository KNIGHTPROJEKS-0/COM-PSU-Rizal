import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

function initializeFirebaseAdmin() {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw new Error(
            "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.",
        );
    }

    try {
        const serviceAccount = require(
            process.env.GOOGLE_APPLICATION_CREDENTIALS,
        );

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log("Firebase Admin SDK initialized successfully.");
        return admin;
    } catch (error) {
        console.error("Error initializing Firebase Admin SDK:", error);
        process.exit(1);
    }
}

export default initializeFirebaseAdmin;
