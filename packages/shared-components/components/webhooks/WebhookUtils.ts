"use client";

import { Webhook } from "svix";

export interface WebhookEvent {
    id: string;
    type: string;
    data: any;
    createdAt: Date;
}

export interface WebhookConfig {
    secret: string;
    tolerance?: number;
}

export class WebhookUtils {
    private webhook: Webhook;

    constructor(config: WebhookConfig) {
        this.webhook = new Webhook(config.secret, {
            tolerance: config.tolerance || 60000, // 1 minute tolerance
        });
    }

    // Verify webhook signature
    async verifyWebhook(
        rawBody: string,
        signature: string,
        timestamp?: string,
    ): Promise<WebhookEvent> {
        try {
            const payload = this.webhook.verify(rawBody, {
                "svix-id": signature,
                "svix-timestamp": timestamp,
            }) as any;

            return {
                id: payload.id,
                type: payload.type,
                data: payload.data,
                createdAt: new Date(payload.created_at),
            };
        } catch (error) {
            throw new Error(`Webhook verification failed: ${error}`);
        }
    }

    // Create webhook signature (for testing)
    signWebhook(payload: any): { signature: string; timestamp: string } {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = this.webhook.sign(JSON.stringify(payload), timestamp);

        return {
            signature,
            timestamp,
        };
    }

    // Handle different webhook event types
    static handleEvent(event: WebhookEvent): void {
        switch (event.type) {
            case "user.created":
                console.log("User created:", event.data);
                // Handle user creation
                break;
            case "user.updated":
                console.log("User updated:", event.data);
                // Handle user update
                break;
            case "user.deleted":
                console.log("User deleted:", event.data);
                // Handle user deletion
                break;
            case "order.created":
                console.log("Order created:", event.data);
                // Handle order creation
                break;
            case "payment.succeeded":
                console.log("Payment succeeded:", event.data);
                // Handle successful payment
                break;
            case "payment.failed":
                console.log("Payment failed:", event.data);
                // Handle failed payment
                break;
            default:
                console.log("Unknown event type:", event.type, event.data);
        }
    }
}

export default WebhookUtils;
