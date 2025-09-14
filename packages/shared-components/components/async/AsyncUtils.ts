"use client";

import async from "async";
import { cn } from "@/lib/utils";

export interface AsyncTask<T = any> {
    (callback: (error?: Error | null, result?: T) => void): void;
}

export interface AsyncResult<T> {
    error?: Error;
    result?: T;
}

export class AsyncUtils {
    // Execute tasks in series
    static async series<T>(tasks: AsyncTask<T>[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            async.series(tasks, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results as T[]);
                }
            });
        });
    }

    // Execute tasks in parallel
    static async parallel<T>(tasks: AsyncTask<T>[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            async.parallel(tasks, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results as T[]);
                }
            });
        });
    }

    // Execute tasks in parallel with limit
    static async parallelLimit<T>(
        tasks: AsyncTask<T>[],
        limit: number,
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            async.parallelLimit(tasks, limit, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results as T[]);
                }
            });
        });
    }

    // Execute tasks in waterfall (each task receives results from previous)
    static async waterfall<T>(tasks: AsyncTask[]): Promise<T> {
        return new Promise((resolve, reject) => {
            async.waterfall(tasks, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result as T);
                }
            });
        });
    }

    // Execute tasks with each (iterate over array)
    static async each<T>(
        items: T[],
        iterator: (item: T, callback: (error?: Error) => void) => void,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            async.each(items, iterator, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    // Execute tasks with eachSeries (iterate over array in series)
    static async eachSeries<T>(
        items: T[],
        iterator: (item: T, callback: (error?: Error) => void) => void,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            async.eachSeries(items, iterator, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    // Map over array with async operations
    static async map<T, R>(
        items: T[],
        iterator: (
            item: T,
            callback: (error?: Error | null, result?: R) => void,
        ) => void,
    ): Promise<R[]> {
        return new Promise((resolve, reject) => {
            async.map(items, iterator, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results as R[]);
                }
            });
        });
    }

    // Filter array with async operations
    static async filter<T>(
        items: T[],
        iterator: (
            item: T,
            callback: (error?: Error | null, keep?: boolean) => void,
        ) => void,
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            async.filter(items, iterator, (results) => {
                resolve(results);
            });
        });
    }

    // Retry operation with backoff
    static async retry<T>(
        task: AsyncTask<T>,
        options: {
            times?: number;
            interval?: number | ((retryCount: number) => number);
            errorFilter?: (error: Error) => boolean;
        } = {},
    ): Promise<T> {
        const { times = 5, interval = 0, errorFilter } = options;

        return new Promise((resolve, reject) => {
            async.retry(
                {
                    times,
                    interval,
                    errorFilter,
                },
                task,
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result as T);
                    }
                },
            );
        });
    }

    // Timeout wrapper
    static async timeout<T>(task: AsyncTask<T>, timeoutMs: number): Promise<T> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);

            task((error, result) => {
                clearTimeout(timeout);
                if (error) {
                    reject(error);
                } else {
                    resolve(result as T);
                }
            });
        });
    }
}

export default AsyncUtils;
