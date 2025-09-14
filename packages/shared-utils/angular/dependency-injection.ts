import 'reflect-metadata';
import { Container, injectable, inject } from 'inversify';

// Angular-like dependency injection system
export const container = new Container();

// Service decorators
export function Injectable(token?: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    const tokenToUse = token || constructor.name;
    container.bind(tokenToUse).to(constructor).inSingletonScope();
    return injectable()(constructor);
  };
}

export function Inject(token: string) {
  return inject(token);
}

// Service base class
@Injectable()
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
  private providers: Provider[] = [];
  private imports: AngularLikeModule[] = [];

  constructor(
    public name: string,
    providers: Provider[] = [],
    imports: AngularLikeModule[] = []
  ) {
    this.providers = providers;
    this.imports = imports;
    this.configureProviders();
  }

  private configureProviders() {
    // Configure providers
    this.providers.forEach(provider => {
      if (provider.useClass) {
        container.bind(provider.provide).to(provider.useClass).inSingletonScope();
      } else if (provider.useValue) {
        container.bind(provider.provide).toConstantValue(provider.useValue);
      } else if (provider.useFactory) {
        const deps = provider.deps?.map(dep => container.get(dep)) || [];
        const instance = provider.useFactory(...deps);
        container.bind(provider.provide).toConstantValue(instance);
      }
    });

    // Configure imports
    this.imports.forEach(module => {
      // Recursively configure imported modules
      module.configureProviders();
    });
  }

  static forRoot(providers: Provider[] = []): AngularLikeModule {
    return new AngularLikeModule('RootModule', providers);
  }

  static forFeature(name: string, providers: Provider[] = []): AngularLikeModule {
    return new AngularLikeModule(name, providers);
  }
}

// Service registry
export class ServiceRegistry {
  private static services = new Map<string, Service>();

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
    const initPromises = Array.from(this.services.values()).map(service => 
      service.initialize()
    );
    await Promise.all(initPromises);
  }

  static async destroyAll(): Promise<void> {
    const destroyPromises = Array.from(this.services.values()).map(service => 
      service.destroy()
    );
    await Promise.all(destroyPromises);
  }
}

// Angular-like injector
export class Injector {
  static get<T>(token: string): T {
    try {
      return container.get<T>(token);
    } catch (error) {
      throw new Error(`Failed to inject ${token}: ${error}`);
    }
  }

  static getOptional<T>(token: string): T | null {
    try {
      return container.get<T>(token);
    } catch {
      return null;
    }
  }
}

// Angular-like providers
export const APP_PROVIDERS = [
  {
    provide: 'APP_CONFIG',
    useValue: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }
  }
];

export const CORE_PROVIDERS = [
  {
    provide: 'LoggerService',
    useClass: class LoggerService extends Service {
      async initialize() {
        console.log('LoggerService initialized');
      }
      async destroy() {
        console.log('LoggerService destroyed');
      }
      log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
        console[level](`[${new Date().toISOString()}] ${message}`);
      }
    }
  },
  {
    provide: 'HttpService',
    useClass: class HttpService extends Service {
      private baseUrl: string;

      constructor(@Inject('APP_CONFIG') config: any) {
        super();
        this.baseUrl = config.apiUrl;
      }

      async initialize() {
        console.log('HttpService initialized');
      }

      async destroy() {
        console.log('HttpService destroyed');
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
      }
    }
  }
];
