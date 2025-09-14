"use client";

import validator from "validator";
import { cn } from "@/lib/utils";

export interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export interface ValidationOptions {
    min?: number;
    max?: number;
    pattern?: RegExp;
    customMessage?: string;
}

export class ValidationUtils {
    static email(
        email: string,
        options: ValidationOptions = {},
    ): ValidationResult {
        const isValid = validator.isEmail(email, {
            allow_display_name: false,
            require_display_name: false,
            allow_utf8_local_part: true,
            require_tld: true,
            allow_ip_domain: false,
            domain_specific_validation: false,
            blacklisted_chars: "",
        });

        return {
            isValid,
            message: isValid
                ? undefined
                : options.customMessage || "Invalid email address",
        };
    }

    static url(url: string, options: ValidationOptions = {}): ValidationResult {
        const isValid = validator.isURL(url, {
            protocols: ["http", "https", "ftp"],
            require_tld: true,
            require_protocol: false,
            require_host: true,
            require_port: false,
            require_valid_protocol: true,
            allow_underscores: false,
            host_whitelist: false,
            host_blacklist: false,
            allow_trailing_dot: false,
            allow_protocol_relative_urls: false,
            disallow_auth: false,
        });

        return {
            isValid,
            message: isValid
                ? undefined
                : options.customMessage || "Invalid URL",
        };
    }

    static phone(
        phone: string,
        locale: validator.MobilePhoneLocale = "en-US",
        options: ValidationOptions = {},
    ): ValidationResult {
        const isValid = validator.isMobilePhone(phone, locale);

        return {
            isValid,
            message: isValid
                ? undefined
                : options.customMessage || "Invalid phone number",
        };
    }

    static creditCard(
        cardNumber: string,
        options: ValidationOptions = {},
    ): ValidationResult {
        const isValid = validator.isCreditCard(cardNumber);

        return {
            isValid,
            message: isValid
                ? undefined
                : options.customMessage || "Invalid credit card number",
        };
    }

    static length(
        value: string,
        options: ValidationOptions = {},
    ): ValidationResult {
        const { min = 0, max } = options;
        const length = value.length;

        if (max !== undefined) {
            const isValid = length >= min && length <= max;
            return {
                isValid,
                message: isValid ? undefined : options.customMessage ||
                    `Length must be between ${min} and ${max} characters`,
            };
        }

        const isValid = length >= min;
        return {
            isValid,
            message: isValid ? undefined : options.customMessage ||
                `Minimum length is ${min} characters`,
        };
    }

    static numeric(
        value: string,
        options: ValidationOptions = {},
    ): ValidationResult {
        const isValid = validator.isNumeric(value, {
            no_symbols: false,
            allow_negatives: true,
            allow_decimal: true,
        });

        return {
            isValid,
            message: isValid
                ? undefined
                : options.customMessage || "Must be a valid number",
        };
    }

    static alphanumeric(
        value: string,
        options: ValidationOptions = {},
    ): ValidationResult {
        const isValid = validator.isAlphanumeric(value, "en-US", {
            ignore: " -_",
        });

        return {
            isValid,
            message: isValid ? undefined : options.customMessage ||
                "Must contain only letters and numbers",
        };
    }

    static password(
        password: string,
        options: ValidationOptions = {},
    ): ValidationResult {
        const isValid = validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
        });

        return {
            isValid,
            message: isValid ? undefined : options.customMessage ||
                "Password must be at least 8 characters with uppercase, lowercase, number, and symbol",
        };
    }

    static custom(
        value: any,
        validatorFn: (value: any) => boolean,
        options: ValidationOptions = {},
    ): ValidationResult {
        const isValid = validatorFn(value);

        return {
            isValid,
            message: isValid
                ? undefined
                : options.customMessage || "Validation failed",
        };
    }
}

export default ValidationUtils;
