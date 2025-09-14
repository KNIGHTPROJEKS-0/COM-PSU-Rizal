import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

// Angular-like route configuration
export interface Route {
  path: string;
  component?: React.ComponentType<any>;
  redirectTo?: string;
  children?: Route[];
  canActivate?: Array<() => boolean | Promise<boolean>>;
  canDeactivate?: Array<() => boolean | Promise<boolean>>;
  data?: Record<string, any>;
  title?: string;
  pathMatch?: 'full' | 'prefix';
}

// Angular-like router service
export class RouterService {
  private _currentRoute$ = new BehaviorSubject<string>('');
  private _routeParams$ = new BehaviorSubject<Record<string, string>>({});
  private _queryParams$ = new BehaviorSubject<Record<string, string>>({});
  private _navigation$ = new Subject<{ from: string; to: string }>();

  constructor() {
    if (typeof window !== 'undefined') {
      this._currentRoute$.next(window.location.pathname);
      this.updateQueryParams();
    }
  }

  get currentRoute$(): Observable<string> {
    return this._currentRoute$.asObservable();
  }

  get routeParams$(): Observable<Record<string, string>> {
    return this._routeParams$.asObservable();
  }

  get queryParams$(): Observable<Record<string, string>> {
    return this._queryParams$.asObservable();
  }

  get navigation$(): Observable<{ from: string; to: string }> {
    return this._navigation$.asObservable();
  }

  get currentRoute(): string {
    return this._currentRoute$.value;
  }

  get routeParams(): Record<string, string> {
    return this._routeParams$.value;
  }

  get queryParams(): Record<string, string> {
    return this._queryParams$.value;
  }

  navigate(route: string, params?: Record<string, string>, queryParams?: Record<string, string>): void {
    const from = this.currentRoute;
    let newRoute = route;

    // Replace route parameters
    if (params) {
      Object.keys(params).forEach(key => {
        newRoute = newRoute.replace(`:${key}`, params[key]);
      });
    }

    // Add query parameters
    if (queryParams) {
      const queryString = new URLSearchParams(queryParams).toString();
      newRoute += `?${queryString}`;
    }

    this._currentRoute$.next(newRoute);
    this._routeParams$.next(params || {});
    this._queryParams$.next(queryParams || {});
    this._navigation$.next({ from, to: newRoute });

    // Navigate using Next.js router
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', newRoute);
    }
  }

  navigateByUrl(url: string): void {
    const from = this.currentRoute;
    this._currentRoute$.next(url);
    this._navigation$.next({ from, to: url });

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', url);
    }
  }

  goBack(): void {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }

  goForward(): void {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  }

  private updateQueryParams(): void {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParams: Record<string, string> = {};
      urlParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      this._queryParams$.next(queryParams);
    }
  }
}

// Angular-like route guard
export abstract class RouteGuard {
  abstract canActivate(route: Route, state: any): boolean | Promise<boolean>;
  abstract canDeactivate(component: any, route: Route, state: any): boolean | Promise<boolean>;
}

// Authentication guard
export class AuthGuard extends RouteGuard {
  constructor(private authService: any) {
    super();
  }

  canActivate(route: Route, state: any): boolean | Promise<boolean> {
    return this.authService.isAuthenticated();
  }

  canDeactivate(component: any, route: Route, state: any): boolean | Promise<boolean> {
    return true;
  }
}

// Admin guard
export class AdminGuard extends RouteGuard {
  constructor(private authService: any) {
    super();
  }

  canActivate(route: Route, state: any): boolean | Promise<boolean> {
    return this.authService.hasRole('admin');
  }

  canDeactivate(component: any, route: Route, state: any): boolean | Promise<boolean> {
    return true;
  }
}

// Angular-like route resolver
export abstract class RouteResolver<T> {
  abstract resolve(route: Route, state: any): T | Promise<T>;
}

// Data resolver
export class DataResolver<T> extends RouteResolver<T> {
  constructor(private dataService: (route: Route) => T | Promise<T>) {
    super();
  }

  resolve(route: Route, state: any): T | Promise<T> {
    return this.dataService(route);
  }
}

// Angular-like route configuration
export class RouteConfig {
  private routes: Route[] = [];
  private guards: Map<string, RouteGuard> = new Map();
  private resolvers: Map<string, RouteResolver<any>> = new Map();

  addRoute(route: Route): void {
    this.routes.push(route);
  }

  addRoutes(routes: Route[]): void {
    this.routes.push(...routes);
  }

  addGuard(name: string, guard: RouteGuard): void {
    this.guards.set(name, guard);
  }

  addResolver(name: string, resolver: RouteResolver<any>): void {
    this.resolvers.set(name, resolver);
  }

  getRoutes(): Route[] {
    return [...this.routes];
  }

  getGuard(name: string): RouteGuard | undefined {
    return this.guards.get(name);
  }

  getResolver(name: string): RouteResolver<any> | undefined {
    return this.resolvers.get(name);
  }

  findRoute(path: string): Route | undefined {
    return this.routes.find(route => this.matchRoute(route, path));
  }

  private matchRoute(route: Route, path: string): boolean {
    if (route.path === path) return true;
    
    // Handle parameterized routes
    const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  }
}

// React hooks for using routing
export function useAngularRouter(): {
  router: RouterService;
  currentRoute: string;
  routeParams: Record<string, string>;
  queryParams: Record<string, string>;
  navigate: (route: string, params?: Record<string, string>, queryParams?: Record<string, string>) => void;
  navigateByUrl: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
} {
  const router = useMemo(() => new RouterService(), []);
  const [currentRoute, setCurrentRoute] = useState(router.currentRoute);
  const [routeParams, setRouteParams] = useState(router.routeParams);
  const [queryParams, setQueryParams] = useState(router.queryParams);

  useEffect(() => {
    const subscription = router.currentRoute$.subscribe(setCurrentRoute);
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const subscription = router.routeParams$.subscribe(setRouteParams);
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const subscription = router.queryParams$.subscribe(setQueryParams);
    return () => subscription.unsubscribe();
  }, [router]);

  const navigate = useCallback((route: string, params?: Record<string, string>, queryParams?: Record<string, string>) => {
    router.navigate(route, params, queryParams);
  }, [router]);

  const navigateByUrl = useCallback((url: string) => {
    router.navigateByUrl(url);
  }, [router]);

  const goBack = useCallback(() => {
    router.goBack();
  }, [router]);

  const goForward = useCallback(() => {
    router.goForward();
  }, [router]);

  return {
    router,
    currentRoute,
    routeParams,
    queryParams,
    navigate,
    navigateByUrl,
    goBack,
    goForward
  };
}

// Angular-like route outlet
export function RouteOutlet({ routes, fallback }: { routes: Route[]; fallback?: React.ComponentType }) {
  const { currentRoute } = useAngularRouter();
  const [currentComponent, setCurrentComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const route = routes.find(r => r.path === currentRoute);
    if (route) {
      if (route.redirectTo) {
        // Handle redirect
        const redirectRoute = routes.find(r => r.path === route.redirectTo);
        if (redirectRoute) {
          setCurrentComponent(redirectRoute.component || null);
        }
      } else {
        setCurrentComponent(route.component || null);
      }
    } else {
      setCurrentComponent(fallback || null);
    }
  }, [currentRoute, routes, fallback]);

  if (!currentComponent) {
    return null;
  }

  const Current = currentComponent;
  return <Current />;
}

// Angular-like route link
export interface RouteLinkProps {
  route: string;
  params?: Record<string, string>;
  queryParams?: Record<string, string>;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

export function RouteLink({ 
  route, 
  params, 
  queryParams, 
  className = '', 
  activeClassName = 'active',
  children,
  onClick
}: RouteLinkProps) {
  const { currentRoute, navigate } = useAngularRouter();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Simple active state check - can be enhanced
    setIsActive(currentRoute === route);
  }, [currentRoute, route]);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(route, params, queryParams);
    onClick?.(event);
  };

  return (
    <a
      href={route}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
    >
      {children}
    </a>
  );
}

// Angular-like route data
export function useRouteData<T>(key: string): T | undefined {
  const { currentRoute } = useAngularRouter();
  const [data, setData] = useState<T | undefined>();

  useEffect(() => {
    // This would typically come from route configuration
    // For now, we'll use a simple approach
    const routeData = (window as any).__ROUTE_DATA__?.[currentRoute]?.[key];
    setData(routeData);
  }, [currentRoute, key]);

  return data;
}

// Angular-like route params
export function useRouteParams(): Record<string, string> {
  const { routeParams } = useAngularRouter();
  return routeParams;
}

// Angular-like query params
export function useQueryParams(): Record<string, string> {
  const { queryParams } = useAngularRouter();
  return queryParams;
}

// Angular-like route title
export function useRouteTitle(): string | undefined {
  const { currentRoute } = useAngularRouter();
  const [title, setTitle] = useState<string | undefined>();

  useEffect(() => {
    // This would typically come from route configuration
    const routeTitle = (window as any).__ROUTE_TITLES__?.[currentRoute];
    setTitle(routeTitle);
  }, [currentRoute]);

  return title;
}

// Route configuration factory
export function createRouteConfig(): RouteConfig {
  return new RouteConfig();
}

// Example route configuration
export const APP_ROUTES: Route[] = [
  {
    path: '/',
    redirectTo: '/dashboard'
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    data: { requiresAuth: true }
  },
  {
    path: '/admin',
    title: 'Admin Panel',
    data: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile/:id',
    title: 'User Profile',
    data: { requiresAuth: true }
  }
];
