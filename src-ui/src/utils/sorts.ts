import type { Order, SortDirection, SortKey, SortMethodName } from "../types/sort.ts";
import { cloneOrders, orderKeyValue } from "./sortUtils.ts";

export interface LocalSortResult {
  sorted: Order[];
  comparisons: number;
  swaps: number;
  timeMs: number;
}

interface Counter {
  comparisons: number;
  swaps: number;
}

function shouldComeFirst(a: number, b: number, dir: SortDirection): boolean {
  return dir === "asc" ? a < b : a > b;
}

function swapAt(arr: Order[], i: number, j: number, c: Counter): void {
  if (i === j) return;
  const tmp: Order = arr[i] as Order;
  arr[i] = arr[j] as Order;
  arr[j] = tmp;
  c.swaps += 1;
}

function bubble(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): void {
  const n: number = arr.length;
  for (let i: number = 0; i < n - 1; i += 1) {
    let exchanged = false;
    for (let j: number = 0; j < n - 1 - i; j += 1) {
      c.comparisons += 1;
      const a: number = orderKeyValue(arr[j] as Order, key);
      const b: number = orderKeyValue(arr[j + 1] as Order, key);
      if (shouldComeFirst(b, a, dir)) {
        swapAt(arr, j, j + 1, c);
        exchanged = true;
      }
    }
    if (!exchanged) break;
  }
}

function selection(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): void {
  const n: number = arr.length;
  for (let i: number = 0; i < n; i += 1) {
    let best: number = i;
    for (let j: number = i + 1; j < n; j += 1) {
      c.comparisons += 1;
      if (shouldComeFirst(orderKeyValue(arr[j] as Order, key), orderKeyValue(arr[best] as Order, key), dir)) {
        best = j;
      }
    }
    swapAt(arr, i, best, c);
  }
}

function insertion(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): void {
  const n: number = arr.length;
  for (let i: number = 1; i < n; i += 1) {
    const current: Order = arr[i] as Order;
    const currentKey: number = orderKeyValue(current, key);
    let j: number = i - 1;
    while (j >= 0) {
      c.comparisons += 1;
      if (!shouldComeFirst(currentKey, orderKeyValue(arr[j] as Order, key), dir)) break;
      arr[j + 1] = arr[j] as Order;
      c.swaps += 1;
      j -= 1;
    }
    arr[j + 1] = current;
  }
}

const CIURA_GAPS: readonly number[] = [701, 301, 132, 57, 23, 10, 4, 1];

function shell(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): void {
  const n: number = arr.length;
  for (const gap of CIURA_GAPS) {
    if (gap >= n) continue;
    for (let i: number = gap; i < n; i += 1) {
      const current: Order = arr[i] as Order;
      const currentKey: number = orderKeyValue(current, key);
      let j: number = i;
      while (j >= gap) {
        c.comparisons += 1;
        if (!shouldComeFirst(currentKey, orderKeyValue(arr[j - gap] as Order, key), dir)) break;
        arr[j] = arr[j - gap] as Order;
        c.swaps += 1;
        j -= gap;
      }
      arr[j] = current;
    }
  }
}

function partition(arr: Order[], low: number, high: number, key: SortKey, dir: SortDirection, c: Counter): number {
  const pivot: number = orderKeyValue(arr[high] as Order, key);
  let i: number = low;
  for (let j: number = low; j < high; j += 1) {
    c.comparisons += 1;
    if (shouldComeFirst(orderKeyValue(arr[j] as Order, key), pivot, dir)) {
      swapAt(arr, i, j, c);
      i += 1;
    }
  }
  swapAt(arr, i, high, c);
  return i;
}

function quickRecursive(arr: Order[], low: number, high: number, key: SortKey, dir: SortDirection, c: Counter): void {
  if (low >= high) return;
  const p: number = partition(arr, low, high, key, dir, c);
  quickRecursive(arr, low, p - 1, key, dir, c);
  quickRecursive(arr, p + 1, high, key, dir, c);
}

function quick(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): void {
  if (arr.length > 1) quickRecursive(arr, 0, arr.length - 1, key, dir, c);
}

function mergeHalves(left: Order[], right: Order[], key: SortKey, dir: SortDirection, c: Counter): Order[] {
  const out: Order[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    c.comparisons += 1;
    if (shouldComeFirst(orderKeyValue(right[j] as Order, key), orderKeyValue(left[i] as Order, key), dir)) {
      out.push(right[j] as Order);
      j += 1;
    } else {
      out.push(left[i] as Order);
      i += 1;
    }
    c.swaps += 1;
  }
  while (i < left.length) {
    out.push(left[i] as Order);
    i += 1;
    c.swaps += 1;
  }
  while (j < right.length) {
    out.push(right[j] as Order);
    j += 1;
    c.swaps += 1;
  }
  return out;
}

function mergeSorted(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): Order[] {
  if (arr.length <= 1) return arr;
  const mid: number = Math.floor(arr.length / 2);
  const left: Order[] = mergeSorted(arr.slice(0, mid), key, dir, c);
  const right: Order[] = mergeSorted(arr.slice(mid), key, dir, c);
  return mergeHalves(left, right, key, dir, c);
}

function merge(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): void {
  const sorted: Order[] = mergeSorted(arr, key, dir, c);
  for (let i: number = 0; i < arr.length; i += 1) {
    arr[i] = sorted[i] as Order;
  }
}

function heapify(arr: Order[], n: number, i: number, key: SortKey, dir: SortDirection, c: Counter): void {
  let extreme: number = i;
  const left: number = 2 * i + 1;
  const right: number = 2 * i + 2;
  if (left < n) {
    c.comparisons += 1;
    if (shouldComeFirst(orderKeyValue(arr[extreme] as Order, key), orderKeyValue(arr[left] as Order, key), dir)) {
      extreme = left;
    }
  }
  if (right < n) {
    c.comparisons += 1;
    if (shouldComeFirst(orderKeyValue(arr[extreme] as Order, key), orderKeyValue(arr[right] as Order, key), dir)) {
      extreme = right;
    }
  }
  if (extreme !== i) {
    swapAt(arr, i, extreme, c);
    heapify(arr, n, extreme, key, dir, c);
  }
}

function heap(arr: Order[], key: SortKey, dir: SortDirection, c: Counter): void {
  const n: number = arr.length;
  for (let i: number = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    heapify(arr, n, i, key, dir, c);
  }
  for (let i: number = n - 1; i > 0; i -= 1) {
    swapAt(arr, 0, i, c);
    heapify(arr, i, 0, key, dir, c);
  }
}

export function runLocalSort(
  input: readonly Order[],
  method: SortMethodName,
  key: SortKey,
  dir: SortDirection,
): LocalSortResult {
  const arr: Order[] = cloneOrders(input);
  const c: Counter = { comparisons: 0, swaps: 0 };
  const t0: number = performance.now();
  switch (method) {
    case "bubble_sort": bubble(arr, key, dir, c); break;
    case "selection_sort": selection(arr, key, dir, c); break;
    case "insertion_sort": insertion(arr, key, dir, c); break;
    case "shell_sort": shell(arr, key, dir, c); break;
    case "quick_sort": quick(arr, key, dir, c); break;
    case "merge_sort": merge(arr, key, dir, c); break;
    case "heap_sort": heap(arr, key, dir, c); break;
  }
  const t1: number = performance.now();
  return { sorted: arr, comparisons: c.comparisons, swaps: c.swaps, timeMs: t1 - t0 };
}
