// Lightweight RxJS interop patterns inspired by Angular's guidance, adapted for React.
import { useEffect, useMemo, useRef } from "react";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

// takeUntilDestroyed: React hook to provide a notifier that completes on unmount.
export function useTakeUntilDestroyed(): Observable<void> {
    const destroy$Ref = useRef<Subject<void> | null>(null);
    if (!destroy$Ref.current) destroy$Ref.current = new Subject<void>();
    useEffect(() => {
        return () => {
            // complete and replace to prevent late emissions after unmount
            destroy$Ref.current?.next();
            destroy$Ref.current?.complete();
        };
    }, []);
    return destroy$Ref.current!.asObservable();
}

// pipeUntilUnmount: Utility to pipe any observable through takeUntil(destroy$)
export function usePipeUntilUnmount<T>() {
    const destroy$ = useTakeUntilDestroyed();
    return useMemo(
        () => (source: Observable<T>) => source.pipe(takeUntil(destroy$)),
        [destroy$],
    );
}

// output(): Create a Subject used as component output and auto-complete on unmount.
export function useOutput<T = any>() {
    const subjectRef = useRef<Subject<T> | null>(null);
    if (!subjectRef.current) subjectRef.current = new Subject<T>();
    const destroy$ = useTakeUntilDestroyed();
    useEffect(() => {
        const sub = destroy$.subscribe({
            complete: () => subjectRef.current?.complete(),
        });
        return () => sub.unsubscribe();
    }, [destroy$]);
    return subjectRef.current!;
}

// subscribeWithUnmount: subscribe and auto-unsubscribe on unmount.
export function useSubscribeWithUnmount<T>(
    observable: Observable<T>,
    next: (v: T) => void,
    error?: (e: any) => void,
    complete?: () => void,
) {
    const untilUnmount = usePipeUntilUnmount<T>();
    useEffect(() => {
        const sub = untilUnmount(observable).subscribe({
            next,
            error,
            complete,
        });
        return () => sub.unsubscribe();
    }, [observable]);
}
