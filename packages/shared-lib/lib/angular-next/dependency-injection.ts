// Lightweight Angular-like dependency injection (no external deps)
type Ctor<T = any> = abstract new (...args: any[]) => T;

type ProviderRecord =
    | {
        type: "class";
        token: string;
        useClass: Ctor;
        scope: "singleton" | "transient";
        instance?: any;
    }
    | { type: "value"; token: string; useValue: any }
    | {
        type: "factory";
        token: string;
        useFactory: (...args: any[]) => any;
        deps?: string[];
        cached?: any;
    };

const registry = new Map<string, ProviderRecord>();

export function clearContainer() {
    registry.clear();
}

export function registerClass(
    token: string,
    useClass: Ctor,
    scope: "singleton" | "transient" = "singleton",
) {
    registry.set(token, { type: "class", token, useClass, scope });
}

export function registerValue(token: string, useValue: any) {
    registry.set(token, { type: "value", token, useValue });
}

export function registerFactory(
    token: string,
    useFactory: (...args: any[]) => any,
    deps?: string[],
) {
    registry.set(token, { type: "factory", token, useFactory, deps });
}

// Service decorators (no-op registration by default, allows @Injectable() usage)
export function Injectable(token?: string) {
    return function <T extends Ctor>(constructor: T) {
        const tokenToUse = token || constructor.name;
        // Default singleton registration if not already provided elsewhere
        if (!registry.has(tokenToUse)) {
            registerClass(tokenToUse, constructor, "singleton");
        }
    };
}

// Parameter decorator placeholder (currently no-op)
export function Inject(_token: string): ParameterDecorator {
    return function () {
        // No-op for now; explicit deps should be wired via providers or factories
    };
}

// Service base class
export abstract class Service {
    abstract initialize(): Promise<void>;
    abstract destroy(): Promise<void>;
}

// Angular-like providers
export interface Provider {
    provide: string;
    useClass?: any;
    useValue?: any;
    useFactory?: (...args: any[]) => any;
    deps?: string[];
}

// Module system
export class AngularLikeModule {
    private readonly providers: Provider[] = [];
    private readonly imports: AngularLikeModule[] = [];

    constructor(
        public name: string,
        providers: Provider[] = [],
        imports: AngularLikeModule[] = [],
    ) {
        this.providers = providers;
        this.imports = imports;
        this.configureProviders();
    }

    private configureProviders() {
        // Configure providers
        this.providers.forEach((provider) => {
            if (provider.useClass) {
                registerClass(provider.provide, provider.useClass, "singleton");
            } else if (provider.useValue) {
                registerValue(provider.provide, provider.useValue);
            } else if (provider.useFactory) {
                registerFactory(
                    provider.provide,
                    provider.useFactory,
                    provider.deps,
                );
            }
        });

        // Configure imports
        this.imports.forEach((module) => {
            // Recursively configure imported modules
            module.configureProviders();
        });
    }

    static forRoot(providers: Provider[] = []): AngularLikeModule {
        return new AngularLikeModule("RootModule", providers);
    }

    static forFeature(
        name: string,
        providers: Provider[] = [],
    ): AngularLikeModule {
        return new AngularLikeModule(name, providers);
    }
}

// Service registry
export class ServiceRegistry {
    private static readonly services = new Map<string, Service>();

    static register<T extends Service>(token: string, service: T): void {
        this.services.set(token, service);
    }

    static get<T extends Service>(token: string): T {
        const service = this.services.get(token);
        if (!service) {
            throw new Error(`Service ${token} not found`);
        }
        return service as T;
    }

    static async initializeAll(): Promise<void> {
        const initPromises = Array.from(this.services.values()).map((service) =>
            service.initialize()
        );
        await Promise.all(initPromises);
    }

    static async destroyAll(): Promise<void> {
        const destroyPromises = Array.from(this.services.values()).map(
            (service) => service.destroy(),
        );
        await Promise.all(destroyPromises);
    }
}

// Angular-like injector
export class Injector {
    static get<T>(token: string): T {
        try {
            const rec = registry.get(token);
            if (!rec) throw new Error(`No provider for ${token}`);
            if (rec.type === "value") return rec.useValue as T;
            if (rec.type === "factory") {
                if (rec.cached !== undefined) return rec.cached as T;
                const args = (rec.deps || []).map((dep) => Injector.get(dep));
                const val = rec.useFactory(...args);
                rec.cached = val;
                return val as T;
            }
            // class
            if (rec.scope === "singleton") {
                if (!rec.instance) {
                    // Note: constructor injection must be done via factory deps for now
                    rec.instance = new (rec.useClass as any)();
                }
                return rec.instance as T;
            }
            return new (rec.useClass as any)() as T;
        } catch (error) {
            throw new Error(`Failed to inject ${token}: ${error}`);
        }
    }

    static getOptional<T>(token: string): T | null {
        try {
            return Injector.get<T>(token);
        } catch {
            return null;
        }
    }
}

// Angular-like providers
export const APP_PROVIDERS = [
    {
        provide: "APP_CONFIG",
        useValue: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL ||
                "http://localhost:3000/api",
            environment: process.env.NODE_ENV || "development",
            version: "1.0.0",
        },
    },
];

export const CORE_PROVIDERS = [
    {
        provide: "LoggerService",
        useClass: class LoggerService extends Service {
            async initialize() {
                console.log("LoggerService initialized");
            }
            async destroy() {
                console.log("LoggerService destroyed");
            }
            log(message: string, level: "info" | "warn" | "error" = "info") {
                console[level](`[${new Date().toISOString()}] ${message}`);
            }
        },
    },
    {
        provide: "HttpService",
        // Prefer factory so we can pass APP_CONFIG without parameter decorators
        useFactory: (config: any) =>
            new (class HttpService extends Service {
                private readonly baseUrl: string;

                constructor() {
                    super();
                    this.baseUrl = config.apiUrl;
                }

                async initialize() {
                    console.log("HttpService initialized");
                }

                async destroy() {
                    console.log("HttpService destroyed");
                }

                async get<T>(url: string): Promise<T> {
                    const response = await fetch(`${this.baseUrl}${url}`);
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return response.json();
                }

                async post<T>(url: string, data: any): Promise<T> {
                    const response = await fetch(`${this.baseUrl}${url}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    return response.json();
                }
            })(),
        deps: ["APP_CONFIG"],
    },
];
