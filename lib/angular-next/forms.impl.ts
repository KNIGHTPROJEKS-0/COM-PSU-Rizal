import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Angular-like form control
export class FormControl<T = any> {
    private _value: T;
    private _validators: Array<(value: T) => any> = [];
    private _errors: Record<string, any> = {};
    private _touched = false;
    private _dirty = false;
    private _disabled = false;
    private _status: "VALID" | "INVALID" | "PENDING" | "DISABLED" = "VALID";

    constructor(
        value: T = null as T,
        validators: Array<(value: T) => any> = [],
    ) {
        this._value = value;
        this._validators = validators;
        this.updateStatus();
    }

    get value(): T {
        return this._value;
    }

    set value(newValue: T) {
        this._value = newValue;
        this._dirty = true;
        this.updateStatus();
    }

    get valid(): boolean {
        return this._status === "VALID";
    }

    get invalid(): boolean {
        return this._status === "INVALID";
    }

    get pending(): boolean {
        return this._status === "PENDING";
    }

    get disabled(): boolean {
        return this._disabled;
    }

    get touched(): boolean {
        return this._touched;
    }

    get dirty(): boolean {
        return this._dirty;
    }

    get errors(): Record<string, any> {
        return { ...this._errors };
    }

    get status(): string {
        return this._status;
    }

    setValue(
        value: T,
        options?: { emitEvent?: boolean; onlySelf?: boolean },
    ): void {
        this._value = value;
        this._dirty = true;
        this.updateStatus();
    }

    patchValue(value: Partial<T>): void {
        this._value = { ...this._value, ...value } as T;
        this._dirty = true;
        this.updateStatus();
    }

    reset(value?: T): void {
        this._value = value ?? null as T;
        this._touched = false;
        this._dirty = false;
        this._errors = {};
        this.updateStatus();
    }

    markAsTouched(): void {
        this._touched = true;
    }

    markAsUntouched(): void {
        this._touched = false;
    }

    markAsDirty(): void {
        this._dirty = true;
    }

    markAsPristine(): void {
        this._dirty = false;
    }

    disable(): void {
        this._disabled = true;
        this._status = "DISABLED";
    }

    enable(): void {
        this._disabled = false;
        this.updateStatus();
    }

    setValidators(validators: Array<(value: T) => any>): void {
        this._validators = validators;
        this.updateStatus();
    }

    addValidator(validator: (value: T) => any): void {
        this._validators.push(validator);
        this.updateStatus();
    }

    removeValidator(validator: (value: T) => any): void {
        const index = this._validators.indexOf(validator);
        if (index > -1) {
            this._validators.splice(index, 1);
            this.updateStatus();
        }
    }

    private updateStatus(): void {
        if (this._disabled) {
            this._status = "DISABLED";
            return;
        }

        this._errors = {};
        let isValid = true;

        for (const validator of this._validators) {
            try {
                const result = validator(this._value);
                if (result && typeof result === "object") {
                    Object.assign(this._errors, result);
                    isValid = false;
                }
            } catch (error) {
                this._errors["validator"] = error;
                isValid = false;
            }
        }

        this._status = isValid ? "VALID" : "INVALID";
    }
}

// Angular-like form group
export class FormGroup<T extends Record<string, any> = any> {
    private _controls: Record<keyof T, FormControl>;
    private _value: T;
    private _errors: Record<string, any> = {};
    private _touched = false;
    private _dirty = false;
    private _disabled = false;
    private _status: "VALID" | "INVALID" | "PENDING" | "DISABLED" = "VALID";

    constructor(controls: Record<keyof T, FormControl>) {
        this._controls = controls;
        this._value = this.calculateValue();
        this.updateStatus();
    }

    get controls(): Record<keyof T, FormControl> {
        return { ...this._controls };
    }

    get value(): T {
        return this.calculateValue();
    }

    get valid(): boolean {
        return this._status === "VALID";
    }

    get invalid(): boolean {
        return this._status === "INVALID";
    }

    get pending(): boolean {
        return this._status === "PENDING";
    }

    get disabled(): boolean {
        return this._disabled;
    }

    get touched(): boolean {
        return this._touched;
    }

    get dirty(): boolean {
        return this._dirty;
    }

    get errors(): Record<string, any> {
        return { ...this._errors };
    }

    get status(): string {
        return this._status;
    }

    getControl<K extends keyof T>(name: K): FormControl<T[K]> {
        return this._controls[name];
    }

    setValue(
        value: T,
        options?: { emitEvent?: boolean; onlySelf?: boolean },
    ): void {
        Object.keys(value).forEach((key) => {
            const control = this._controls[key as keyof T];
            if (control) {
                control.setValue(value[key as keyof T]);
            }
        });
        this._value = this.calculateValue();
        this._dirty = true;
        this.updateStatus();
    }

    patchValue(value: Partial<T>): void {
        Object.keys(value).forEach((key) => {
            const control = this._controls[key as keyof T];
            if (control) {
                control.patchValue(value[key as keyof T] as any);
            }
        });
        this._value = this.calculateValue();
        this._dirty = true;
        this.updateStatus();
    }

    reset(value?: T): void {
        Object.values(this._controls).forEach((control) => {
            control.reset();
        });
        if (value) {
            this.setValue(value);
        }
        this._touched = false;
        this._dirty = false;
        this._errors = {};
        this.updateStatus();
    }

    markAsTouched(): void {
        this._touched = true;
        Object.values(this._controls).forEach((control) => {
            control.markAsTouched();
        });
    }

    markAsUntouched(): void {
        this._touched = false;
        Object.values(this._controls).forEach((control) => {
            control.markAsUntouched();
        });
    }

    markAsDirty(): void {
        this._dirty = true;
        Object.values(this._controls).forEach((control) => {
            control.markAsDirty();
        });
    }

    markAsPristine(): void {
        this._dirty = false;
        Object.values(this._controls).forEach((control) => {
            control.markAsPristine();
        });
    }

    disable(): void {
        this._disabled = true;
        this._status = "DISABLED";
        Object.values(this._controls).forEach((control) => {
            control.disable();
        });
    }

    enable(): void {
        this._disabled = false;
        Object.values(this._controls).forEach((control) => {
            control.enable();
        });
        this.updateStatus();
    }

    private calculateValue(): T {
        const value = {} as T;
        Object.keys(this._controls).forEach((key) => {
            value[key as keyof T] = this._controls[key as keyof T].value;
        });
        return value;
    }

    private updateStatus(): void {
        if (this._disabled) {
            this._status = "DISABLED";
            return;
        }

        this._errors = {};
        let isValid = true;

        Object.values(this._controls).forEach((control) => {
            if (!control.valid) {
                isValid = false;
                Object.assign(this._errors, control.errors);
            }
        });

        this._status = isValid ? "VALID" : "INVALID";
    }
}

// Angular-like form array
export class FormArray<T = any> {
    private _controls: FormControl<T>[] = [];
    private _value: T[];
    private _errors: Record<string, any> = {};
    private _touched = false;
    private _dirty = false;
    private _disabled = false;
    private _status: "VALID" | "INVALID" | "PENDING" | "DISABLED" = "VALID";

    constructor(controls: FormControl<T>[] = []) {
        this._controls = controls;
        this._value = this.calculateValue();
        this.updateStatus();
    }

    get controls(): FormControl<T>[] {
        return [...this._controls];
    }

    get value(): T[] {
        return this.calculateValue();
    }

    get length(): number {
        return this._controls.length;
    }

    get valid(): boolean {
        return this._status === "VALID";
    }

    get invalid(): boolean {
        return this._status === "INVALID";
    }

    get pending(): boolean {
        return this._status === "PENDING";
    }

    get disabled(): boolean {
        return this._disabled;
    }

    get touched(): boolean {
        return this._touched;
    }

    get dirty(): boolean {
        return this._dirty;
    }

    get errors(): Record<string, any> {
        return { ...this._errors };
    }

    get status(): string {
        return this._status;
    }

    at(index: number): FormControl<T> {
        return this._controls[index];
    }

    push(control: FormControl<T>): void {
        this._controls.push(control);
        this._value = this.calculateValue();
        this._dirty = true;
        this.updateStatus();
    }

    insert(index: number, control: FormControl<T>): void {
        this._controls.splice(index, 0, control);
        this._value = this.calculateValue();
        this._dirty = true;
        this.updateStatus();
    }

    removeAt(index: number): void {
        this._controls.splice(index, 1);
        this._value = this.calculateValue();
        this._dirty = true;
        this.updateStatus();
    }

    setValue(
        value: T[],
        options?: { emitEvent?: boolean; onlySelf?: boolean },
    ): void {
        this._controls.forEach((control, index) => {
            if (value[index] !== undefined) {
                control.setValue(value[index]);
            }
        });
        this._value = this.calculateValue();
        this._dirty = true;
        this.updateStatus();
    }

    patchValue(value: Partial<T>[]): void {
        this._controls.forEach((control, index) => {
            if (value[index] !== undefined) {
                control.patchValue(value[index] as T);
            }
        });
        this._value = this.calculateValue();
        this._dirty = true;
        this.updateStatus();
    }

    reset(value?: T[]): void {
        this._controls.forEach((control) => {
            control.reset();
        });
        if (value) {
            this.setValue(value);
        }
        this._touched = false;
        this._dirty = false;
        this._errors = {};
        this.updateStatus();
    }

    markAsTouched(): void {
        this._touched = true;
        this._controls.forEach((control) => {
            control.markAsTouched();
        });
    }

    markAsUntouched(): void {
        this._touched = false;
        this._controls.forEach((control) => {
            control.markAsUntouched();
        });
    }

    markAsDirty(): void {
        this._dirty = true;
        this._controls.forEach((control) => {
            control.markAsDirty();
        });
    }

    markAsPristine(): void {
        this._dirty = false;
        this._controls.forEach((control) => {
            control.markAsPristine();
        });
    }

    disable(): void {
        this._disabled = true;
        this._status = "DISABLED";
        this._controls.forEach((control) => {
            control.disable();
        });
    }

    enable(): void {
        this._disabled = false;
        this._controls.forEach((control) => {
            control.enable();
        });
        this.updateStatus();
    }

    private calculateValue(): T[] {
        return this._controls.map((control) => control.value);
    }

    private updateStatus(): void {
        if (this._disabled) {
            this._status = "DISABLED";
            return;
        }

        this._errors = {};
        let isValid = true;

        this._controls.forEach((control, index) => {
            if (!control.valid) {
                isValid = false;
                this._errors[index.toString()] = control.errors;
            }
        });

        this._status = isValid ? "VALID" : "INVALID";
    }
}

// React hooks for using forms
export function useAngularForm<T extends FieldValues>(
    schema?: z.ZodSchema<T>,
) {
    const form = useForm<T>({
        resolver: schema ? zodResolver(schema) : undefined,
        mode: "onChange",
    });

    const formGroup = useMemo(() => {
        const controls: Record<string, FormControl> = {};
        Object.keys(form.getValues()).forEach((key) => {
            controls[key] = new FormControl(form.getValues()[key as keyof T]);
        });
        return new FormGroup(controls);
    }, [form]);

    const updateFormGroup = useCallback(() => {
        const values = form.getValues();
        formGroup.setValue(values);
    }, [form, formGroup]);

    useEffect(() => {
        updateFormGroup();
    }, [updateFormGroup]);

    return {
        form,
        formGroup,
        control: form.control,
        handleSubmit: form.handleSubmit,
        watch: form.watch,
        setValue: form.setValue,
        getValues: form.getValues,
        reset: form.reset,
        formState: form.formState,
    };
}

// Angular-like form builder
export class FormBuilder {
    static control<T>(
        value: T = null as T,
        validators: Array<(value: T) => any> = [],
    ): FormControl<T> {
        return new FormControl(value, validators);
    }

    static group<T extends Record<string, any>>(
        controls: Record<keyof T, FormControl>,
    ): FormGroup<T> {
        return new FormGroup(controls);
    }

    static array<T>(controls: FormControl<T>[] = []): FormArray<T> {
        return new FormArray(controls);
    }
}

// Angular-like validators
export class Validators {
    static required(value: any): any {
        if (value === null || value === undefined || value === "") {
            return { required: true };
        }
        return null;
    }

    static email(value: string): any {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return { email: true };
        }
        return null;
    }

    static minLength(minLength: number) {
        return (value: string): any => {
            if (value && value.length < minLength) {
                return {
                    minlength: {
                        requiredLength: minLength,
                        actualLength: value.length,
                    },
                };
            }
            return null;
        };
    }

    static maxLength(maxLength: number) {
        return (value: string): any => {
            if (value && value.length > maxLength) {
                return {
                    maxlength: {
                        requiredLength: maxLength,
                        actualLength: value.length,
                    },
                };
            }
            return null;
        };
    }

    static min(min: number) {
        return (value: number): any => {
            if (value !== null && value !== undefined && value < min) {
                return { min: { min, actual: value } };
            }
            return null;
        };
    }

    static max(max: number) {
        return (value: number): any => {
            if (value !== null && value !== undefined && value > max) {
                return { max: { max, actual: value } };
            }
            return null;
        };
    }

    static pattern(pattern: RegExp) {
        return (value: string): any => {
            if (value && !pattern.test(value)) {
                return {
                    pattern: {
                        requiredPattern: pattern.toString(),
                        actualValue: value,
                    },
                };
            }
            return null;
        };
    }
}
