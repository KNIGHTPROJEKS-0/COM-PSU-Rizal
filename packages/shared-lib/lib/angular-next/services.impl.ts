import { Injectable, Injector } from "./dependency-injection";
import { BehaviorSubject, from, Observable, Subject, throwError } from "rxjs";
import {
    catchError,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
} from "rxjs/operators";
import { useEffect, useState } from "react";

// Angular-like service base class
@Injectable()
export abstract class AngularLikeService {
    protected loading$ = new BehaviorSubject<boolean>(false);
    protected error$ = new Subject<Error>();

    abstract initialize(): Promise<void>;
    abstract destroy(): Promise<void>;

    get isLoading$(): Observable<boolean> {
        return this.loading$.asObservable();
    }

    get errors$(): Observable<Error> {
        return this.error$.asObservable();
    }

    protected setLoading(loading: boolean): void {
        this.loading$.next(loading);
    }

    protected handleError(error: Error): void {
        this.error$.next(error);
    }
}

// HTTP Service
@Injectable()
export class HttpService extends AngularLikeService {
    private readonly baseUrl: string;

    constructor() {
        super();
        const config = Injector.get<any>("APP_CONFIG");
        this.baseUrl = config.apiUrl;
    }

    async initialize(): Promise<void> {
        console.log("HttpService initialized");
    }

    async destroy(): Promise<void> {
        console.log("HttpService destroyed");
    }

    get<T>(url: string, options?: RequestInit): Observable<T> {
        this.setLoading(true);
        const req$ = from(fetch(`${this.baseUrl}${url}`, {
            method: "GET",
            ...options,
        })).pipe(
            switchMap((response: Response) => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return from(response.json() as Promise<T>);
            }),
            catchError((error: any) => {
                this.handleError(error);
                return throwError(() => error);
            }),
        );
        return req$.pipe(tap(() => this.setLoading(false)));
    }

    post<T>(url: string, data: any, options?: RequestInit): Observable<T> {
        this.setLoading(true);
        const req$ = from(fetch(`${this.baseUrl}${url}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            ...options,
        })).pipe(
            switchMap((response: Response) => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return from(response.json() as Promise<T>);
            }),
            catchError((error: any) => {
                this.handleError(error);
                return throwError(() => error);
            }),
        );
        return req$.pipe(tap(() => this.setLoading(false)));
    }

    put<T>(url: string, data: any, options?: RequestInit): Observable<T> {
        this.setLoading(true);
        const req$ = from(fetch(`${this.baseUrl}${url}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            ...options,
        })).pipe(
            switchMap((response: Response) => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return from(response.json() as Promise<T>);
            }),
            catchError((error: any) => {
                this.handleError(error);
                return throwError(() => error);
            }),
        );
        return req$.pipe(tap(() => this.setLoading(false)));
    }

    delete<T>(url: string, options?: RequestInit): Observable<T> {
        this.setLoading(true);
        const req$ = from(fetch(`${this.baseUrl}${url}`, {
            method: "DELETE",
            ...options,
        })).pipe(
            switchMap((response: Response) => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return from(response.json() as Promise<T>);
            }),
            catchError((error: any) => {
                this.handleError(error);
                return throwError(() => error);
            }),
        );
        return req$.pipe(tap(() => this.setLoading(false)));
    }
}

// State Management Service
@Injectable()
export class StateService<T> extends AngularLikeService {
    private readonly stateSubject = new BehaviorSubject<T>({} as T);

    constructor(initialState: T) {
        super();
        this.stateSubject.next(initialState);
    }

    async initialize(): Promise<void> {
        console.log("StateService initialized");
    }

    async destroy(): Promise<void> {
        console.log("StateService destroyed");
    }

    get state(): T {
        return this.stateSubject.value;
    }

    get state$(): Observable<T> {
        return this.stateSubject.asObservable();
    }

    setState(newState: Partial<T>): void {
        this.stateSubject.next({ ...this.stateSubject.value, ...newState });
    }

    updateState(updater: (currentState: T) => T): void {
        this.stateSubject.next(updater(this.stateSubject.value));
    }

    select<K>(selector: (state: T) => K): Observable<K> {
        return this.stateSubject.pipe(
            map(selector),
            distinctUntilChanged(),
        );
    }
}

// Cache Service
@Injectable()
export class CacheService extends AngularLikeService {
    private readonly cache = new Map<
        string,
        { data: any; timestamp: number; ttl: number }
    >();

    async initialize(): Promise<void> {
        console.log("CacheService initialized");
    }

    async destroy(): Promise<void> {
        this.cache.clear();
        console.log("CacheService destroyed");
    }

    set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
        });
    }

    get<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data as T;
    }

    has(key: string): boolean {
        const cached = this.cache.get(key);
        if (!cached) return false;

        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        return this.cache.size;
    }
}

// Event Service
@Injectable()
export class EventService extends AngularLikeService {
    private readonly events = new Map<string, Subject<any>>();

    async initialize(): Promise<void> {
        console.log("EventService initialized");
    }

    async destroy(): Promise<void> {
        this.events.forEach((subject) => subject.complete());
        this.events.clear();
        console.log("EventService destroyed");
    }

    emit(eventName: string, data?: any): void {
        const subject = this.events.get(eventName);
        if (subject) {
            subject.next(data);
        }
    }

    on<T>(eventName: string): Observable<T> {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Subject<T>());
        }
        return this.events.get(eventName)!.asObservable();
    }

    off(eventName: string): void {
        const subject = this.events.get(eventName);
        if (subject) {
            subject.complete();
            this.events.delete(eventName);
        }
    }
}

// Local Storage Service
@Injectable()
export class LocalStorageService extends AngularLikeService {
    async initialize(): Promise<void> {
        console.log("LocalStorageService initialized");
    }

    async destroy(): Promise<void> {
        console.log("LocalStorageService destroyed");
    }

    setItem(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            this.handleError(error as Error);
        }
    }

    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            this.handleError(error as Error);
            return null;
        }
    }

    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            this.handleError(error as Error);
        }
    }

    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            this.handleError(error as Error);
        }
    }
}

// Logger Service
@Injectable()
export class LoggerService extends AngularLikeService {
    private logs: Array<
        { level: string; message: string; timestamp: Date; data?: any }
    > = [];

    async initialize(): Promise<void> {
        console.log("LoggerService initialized");
    }

    async destroy(): Promise<void> {
        console.log("LoggerService destroyed");
    }

    log(message: string, data?: any): void {
        this.addLog("info", message, data);
        console.log(`[INFO] ${message}`, data);
    }

    warn(message: string, data?: any): void {
        this.addLog("warn", message, data);
        console.warn(`[WARN] ${message}`, data);
    }

    error(message: string, data?: any): void {
        this.addLog("error", message, data);
        console.error(`[ERROR] ${message}`, data);
    }

    debug(message: string, data?: any): void {
        this.addLog("debug", message, data);
        console.debug(`[DEBUG] ${message}`, data);
    }

    private addLog(level: string, message: string, data?: any): void {
        this.logs.push({
            level,
            message,
            timestamp: new Date(),
            data,
        });

        // Keep only last 1000 logs
        if (this.logs.length > 1000) {
            this.logs = this.logs.slice(-1000);
        }
    }

    getLogs(): Array<
        { level: string; message: string; timestamp: Date; data?: any }
    > {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

// React hooks for using services
export function useService<T extends AngularLikeService>(service: T): T {
    return service;
}

export function useObservableService<T>(
    observable: Observable<T>,
    initialValue: T,
): T {
    const [value, setValue] = useState<T>(initialValue);
    useEffect(() => {
        const sub = observable.subscribe(setValue);
        return () => sub.unsubscribe();
    }, [observable]);
    return value;
}

// Service factory
export class ServiceFactory {
    static createHttpService(): HttpService {
        return new HttpService();
    }

    static createStateService<T>(initialState: T): StateService<T> {
        return new StateService(initialState);
    }

    static createCacheService(): CacheService {
        return new CacheService();
    }

    static createEventService(): EventService {
        return new EventService();
    }

    static createLocalStorageService(): LocalStorageService {
        return new LocalStorageService();
    }

    static createLoggerService(): LoggerService {
        return new LoggerService();
    }
}
