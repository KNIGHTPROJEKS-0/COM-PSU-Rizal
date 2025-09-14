"use client";

import { get } from "env-var";

export interface EnvConfig {
    // Database
    DATABASE_URL?: string;
    DB_HOST?: string;
    DB_PORT?: number;
    DB_NAME?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;

    // API
    API_URL?: string;
    API_KEY?: string;
    JWT_SECRET?: string;

    // External Services
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;

    // App Config
    NODE_ENV?: "development" | "production" | "test";
    PORT?: number;
    HOST?: string;

    // Email
    SMTP_HOST?: string;
    SMTP_PORT?: number;
    SMTP_USER?: string;
    SMTP_PASS?: string;

    // File Upload
    UPLOAD_PATH?: string;
    MAX_FILE_SIZE?: number;

    // Redis (if using)
    REDIS_URL?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: number;
    REDIS_PASSWORD?: string;
}

export class EnvUtils {
    private static env = get;

    static getConfig(): EnvConfig {
        return {
            // Database
            DATABASE_URL: this.env("DATABASE_URL").asString(),
            DB_HOST: this.env("DB_HOST").asString(),
            DB_PORT: this.env("DB_PORT").asPortNumber(),
            DB_NAME: this.env("DB_NAME").asString(),
            DB_USER: this.env("DB_USER").asString(),
            DB_PASSWORD: this.env("DB_PASSWORD").asString(),

            // API
            API_URL: this.env("API_URL").asUrlString(),
            API_KEY: this.env("API_KEY").asString(),
            JWT_SECRET: this.env("JWT_SECRET").required().asString(),

            // External Services
            SUPABASE_URL: this.env("SUPABASE_URL").asUrlString(),
            SUPABASE_ANON_KEY: this.env("SUPABASE_ANON_KEY").asString(),
            SUPABASE_SERVICE_ROLE_KEY: this.env("SUPABASE_SERVICE_ROLE_KEY")
                .asString(),

            // App Config
            NODE_ENV: this.env("NODE_ENV").asEnum([
                "development",
                "production",
                "test",
            ]),
            PORT: this.env("PORT").asPortNumber(),
            HOST: this.env("HOST").asString(),

            // Email
            SMTP_HOST: this.env("SMTP_HOST").asString(),
            SMTP_PORT: this.env("SMTP_PORT").asPortNumber(),
            SMTP_USER: this.env("SMTP_USER").asString(),
            SMTP_PASS: this.env("SMTP_PASS").asString(),

            // File Upload
            UPLOAD_PATH: this.env("UPLOAD_PATH").asString(),
            MAX_FILE_SIZE: this.env("MAX_FILE_SIZE").asIntPositive(),

            // Redis
            REDIS_URL: this.env("REDIS_URL").asUrlString(),
            REDIS_HOST: this.env("REDIS_HOST").asString(),
            REDIS_PORT: this.env("REDIS_PORT").asPortNumber(),
            REDIS_PASSWORD: this.env("REDIS_PASSWORD").asString(),
        };
    }

    static getString(key: string, defaultValue?: string): string {
        return this.env(key).default(defaultValue || "").asString();
    }

    static getNumber(key: string, defaultValue?: number): number {
        return this.env(key).default(defaultValue || 0).asInt();
    }

    static getBoolean(key: string, defaultValue?: boolean): boolean {
        return this.env(key).default(defaultValue || false).asBool();
    }

    static getUrl(key: string, defaultValue?: string): string {
        return this.env(key).default(defaultValue || "").asUrlString();
    }

    static getPort(key: string, defaultValue?: number): number {
        return this.env(key).default(defaultValue || 3000).asPortNumber();
    }

    static getRequiredString(key: string): string {
        return this.env(key).required().asString();
    }

    static getRequiredNumber(key: string): number {
        return this.env(key).required().asInt();
    }

    static getEnum<T extends string>(
        key: string,
        values: T[],
        defaultValue?: T,
    ): T {
        return this.env(key).default(defaultValue).asEnum(values);
    }

    static getJson<T = any>(key: string, defaultValue?: T): T {
        return this.env(key).default(defaultValue).asJson();
    }

    static validateConfig(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        try {
            // Required environment variables
            const requiredVars = ["JWT_SECRET"];

            for (const varName of requiredVars) {
                try {
                    this.getRequiredString(varName);
                } catch (error) {
                    errors.push(`${varName} is required but not set`);
                }
            }

            // URL validations
            if (this.getString("API_URL") && !this.getUrl("API_URL")) {
                errors.push("API_URL must be a valid URL");
            }

            if (
                this.getString("SUPABASE_URL") && !this.getUrl("SUPABASE_URL")
            ) {
                errors.push("SUPABASE_URL must be a valid URL");
            }

            // Port validations
            if (
                this.getNumber("DB_PORT") &&
                (this.getNumber("DB_PORT") < 1 ||
                    this.getNumber("DB_PORT") > 65535)
            ) {
                errors.push("DB_PORT must be between 1 and 65535");
            }

            if (
                this.getNumber("PORT") &&
                (this.getNumber("PORT") < 1 || this.getNumber("PORT") > 65535)
            ) {
                errors.push("PORT must be between 1 and 65535");
            }

            return {
                isValid: errors.length === 0,
                errors,
            };
        } catch (error) {
            return {
                isValid: false,
                errors: [`Configuration validation failed: ${error}`],
            };
        }
    }
}

export default EnvUtils;
