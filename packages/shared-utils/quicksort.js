// Quicksort (immutable) with optional comparator and 3-way partition
// Usage:
//   import { quicksort } from '@/lib/quicksort';
//   quicksort([3, 1, 2]);
//   quicksort(users, (a, b) => a.age - b.age);

/**
 * Sorts an array without mutating it using quicksort.
 * - Average: O(n log n)
 * - Worst: O(n^2) (mitigated via median-of-three + 3-way partition)
 * @template T
 * @param {T[]} arr Input array (not mutated)
 * @param {(a: T, b: T) => number} [cmp] Comparator returning negative/zero/positive
 * @returns {T[]} New sorted array
 */
export function quicksort(arr, cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
  if (!Array.isArray(arr)) throw new TypeError('quicksort: arr must be an array');
  const n = arr.length;
  if (n <= 1) return arr.slice();

  // Median-of-three pivot selection to avoid worst-case on sorted/reverse-sorted inputs
  const a = arr[0];
  const b = arr[(n / 2) | 0];
  const c = arr[n - 1];
  const pivot = [a, b, c].sort(cmp)[1];

  const lt = []; // less than pivot
  const eq = []; // equal to pivot
  const gt = []; // greater than pivot

  for (let i = 0; i < n; i++) {
    const v = arr[i];
    const r = cmp(v, pivot);
    if (r < 0) lt.push(v);
    else if (r > 0) gt.push(v);
    else eq.push(v);
  }

  const left = lt.length > 1 ? quicksort(lt, cmp) : lt;
  const right = gt.length > 1 ? quicksort(gt, cmp) : gt;
  return left.concat(eq, right);
}
