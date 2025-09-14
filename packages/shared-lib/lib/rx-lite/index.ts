// Minimal rx-lite implementation to satisfy basic Observable patterns used in this project.
// Note: This is a lightweight fallback. Prefer real 'rxjs' in production.

export type Teardown = { unsubscribe(): void } | (() => void) | void;

export class Subscription {
    private closed = false;
    private teardowns: Array<() => void> = [];
    add(teardown: Teardown) {
        if (!teardown) return;
        const fn = typeof teardown === "function"
            ? teardown
            : () => teardown.unsubscribe();
        this.teardowns.push(fn);
    }
    unsubscribe() {
        if (this.closed) return;
        this.closed = true;
        for (const td of this.teardowns.splice(0)) {
            try {
                td();
            } catch {}
        }
    }
}

export interface Observer<T> {
    next(value: T): void;
    error?(err: any): void;
    complete?(): void;
}

export class Observable<T> {
    constructor(private _subscribe: (observer: Observer<T>) => Teardown) {}

    subscribe(
        next?: ((v: T) => void) | Partial<Observer<T>>,
        error?: (e: any) => void,
        complete?: () => void,
    ): Subscription {
        const sub = new Subscription();
        const observer: Observer<T> = typeof next === "function"
            ? {
                next,
                error: error || (() => {}),
                complete: complete || (() => {}),
            } as Observer<T>
            : {
                next: (next as Partial<Observer<T>>)?.next || (() => {}),
                error: (next as Partial<Observer<T>>)?.error || (() => {}),
                complete: (next as Partial<Observer<T>>)?.complete ||
                    (() => {}),
            } as Observer<T>;
        const teardown = this._subscribe(observer);
        sub.add(teardown);
        return sub;
    }

    pipe<A>(op1: (src: Observable<T>) => Observable<A>): Observable<A>;
    pipe<A, B>(
        op1: (src: Observable<T>) => Observable<A>,
        op2: (src: Observable<A>) => Observable<B>,
    ): Observable<B>;
    pipe(...ops: Array<(src: any) => any>): any {
        return ops.reduce((prev, op) => op(prev), this as any);
    }
}

export class Subject<T> extends Observable<T> {
    private observers: Set<Observer<T>> = new Set();
    private isComplete = false;
    constructor() {
        super((observer) => {
            if (this.isComplete) {
                observer.complete && observer.complete();
                return;
            }
            this.observers.add(observer);
            return () => {
                this.observers.delete(observer);
            };
        });
    }
    next(value: T) {
        if (this.isComplete) return;
        for (const obs of Array.from(this.observers)) {
            try {
                obs.next(value);
            } catch {}
        }
    }
    error(err: any) {
        if (this.isComplete) return;
        for (const obs of Array.from(this.observers)) {
            try {
                obs.error && obs.error(err);
            } catch {}
        }
        this.complete();
    }
    complete() {
        if (this.isComplete) return;
        this.isComplete = true;
        for (const obs of Array.from(this.observers)) {
            try {
                obs.complete && obs.complete();
            } catch {}
        }
        this.observers.clear();
    }
    asObservable(): Observable<T> {
        return this;
    }
}

export class BehaviorSubject<T> extends Subject<T> {
    private _value: T;
    constructor(initialValue: T) {
        super();
        this._value = initialValue;
    }
    override subscribe(next?: any, error?: any, complete?: any): Subscription {
        const sub = super.subscribe(next, error, complete);
        // emit current value immediately to next
        const obs: Partial<Observer<T>> = typeof next === "function"
            ? { next }
            : next || {};
        try {
            (obs.next || (() => {}))(this._value);
        } catch {}
        return sub;
    }
    get value(): T {
        return this._value;
    }
    override next(value: T) {
        this._value = value;
        super.next(value);
    }
}

export function from<T>(input: Promise<T> | T[] | Iterable<T>): Observable<T> {
    if (input instanceof Promise) {
        return new Observable<T>((observer) => {
            input.then((v) => {
                observer.next(v);
                observer.complete && observer.complete();
            })
                .catch((err) => observer.error && observer.error(err));
            return () => {};
        });
    }
    return new Observable<T>((observer) => {
        for (const v of input as Iterable<T>) {
            observer.next(v);
        }
        observer.complete && observer.complete();
        return () => {};
    });
}

export function throwError(factory: () => any): Observable<never> {
    return new Observable<never>((observer) => {
        observer.error && observer.error(factory());
        return () => {};
    });
}

export type OperatorFunction<T, R> = (source: Observable<T>) => Observable<R>;

// Operators
export function map<T, R>(project: (v: T) => R): OperatorFunction<T, R> {
    return (source) =>
        new Observable<R>((observer) =>
            source.subscribe({
                next: (v) => observer.next(project(v)),
                error: (e) => observer.error && observer.error(e),
                complete: () => observer.complete && observer.complete(),
            })
        );
}

export function catchError<T>(
    selector: (err: any) => Observable<T>,
): OperatorFunction<T, T> {
    return (source) =>
        new Observable<T>((observer) =>
            source.subscribe({
                next: (v) => observer.next(v),
                error: (e) => selector(e).subscribe(observer),
                complete: () => observer.complete && observer.complete(),
            })
        );
}

export function distinctUntilChanged<T>(
    compare: (a: T, b: T) => boolean = (a, b) => a === b,
): OperatorFunction<T, T> {
    return (source) =>
        new Observable<T>((observer) => {
            let hasPrev = false;
            let prev: T;
            return source.subscribe({
                next: (v) => {
                    if (!hasPrev || !compare(prev!, v)) {
                        hasPrev = true;
                        prev = v;
                        observer.next(v);
                    }
                },
                error: (e) => observer.error && observer.error(e),
                complete: () => observer.complete && observer.complete(),
            });
        });
}

export function switchMap<T, R>(
    project: (v: T) => Observable<R>,
): OperatorFunction<T, R> {
    return (source) =>
        new Observable<R>((observer) => {
            let innerSub: Subscription | null = null;
            const outerSub = source.subscribe({
                next: (v) => {
                    if (innerSub) innerSub.unsubscribe();
                    innerSub = project(v).subscribe({
                        next: (iv) => observer.next(iv),
                        error: (e) => observer.error && observer.error(e),
                        complete: () => {},
                    });
                },
                error: (e) => observer.error && observer.error(e),
                complete: () => {
                    // complete when outer completes; inner completion handled above
                    observer.complete && observer.complete();
                },
            });
            return () => {
                outerSub.unsubscribe();
                if (innerSub) innerSub.unsubscribe();
            };
        });
}

export function tap<T>(
    observer: Partial<Observer<T>> | ((v: T) => void),
): OperatorFunction<T, T> {
    const toObserver = (obs: any): Partial<Observer<T>> =>
        typeof obs === "function" ? { next: obs } : (obs || {});
    return (source) =>
        new Observable<T>((outerObserver) =>
            source.subscribe({
                next: (v) => {
                    try {
                        toObserver(observer).next &&
                            toObserver(observer).next!(v);
                    } catch {}
                    outerObserver.next(v);
                },
                error: (e) => {
                    try {
                        toObserver(observer).error &&
                            toObserver(observer).error!(e);
                    } catch {}
                    outerObserver.error && outerObserver.error(e);
                },
                complete: () => {
                    try {
                        toObserver(observer).complete &&
                            toObserver(observer).complete!();
                    } catch {}
                    outerObserver.complete && outerObserver.complete();
                },
            })
        );
}

export function takeUntil<T>(
    notifier: Observable<any>,
): OperatorFunction<T, T> {
    return (source) =>
        new Observable<T>((observer) => {
            let complete = false;
            const notifSub = notifier.subscribe({
                next: () => {
                    complete = true;
                    observer.complete && observer.complete();
                },
                error: (e) => observer.error && observer.error(e),
            });
            const srcSub = source.subscribe({
                next: (v) => {
                    if (!complete) observer.next(v);
                },
                error: (e) => observer.error && observer.error(e),
                complete: () => observer.complete && observer.complete(),
            });
            return () => {
                notifSub.unsubscribe();
                srcSub.unsubscribe();
            };
        });
}
