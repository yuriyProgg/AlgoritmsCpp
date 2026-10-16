export interface Order {
  id: number;
  cargo_type: string;
  distance_weight: number;
  price_weight: number;
  time_critical_weight: number;
  composite_score: number;
}

export type SortKey =
  | "composite_score"
  | "price_weight"
  | "distance_weight"
  | "time_critical_weight";

export type SortDirection = "asc" | "desc";

export type SortMethodName =
  | "bubble_sort"
  | "selection_sort"
  | "insertion_sort"
  | "shell_sort"
  | "quick_sort"
  | "merge_sort"
  | "heap_sort";

export type SelectionPhase = "init" | "compare" | "new_min" | "swap" | "pass_done" | "done";

export interface SelectionStep {
  snapshot: Order[];
  pass: number;
  sortedCount: number;
  minIndex: number;
  scanIndex: number;
  comparedPair: readonly [number, number] | null;
  swappedPair: readonly [number, number] | null;
  comparisons: number;
  swaps: number;
  phase: SelectionPhase;
  note: string;
}

export type ParseResult = { ok: true; orders: Order[] } | { ok: false; error: string };

export interface AppliedInfo {
  methodId: string;
  title: string;
  source: string;
  comparisons: number | null;
  swaps: number | null;
  timeMs: number | null;
}

export interface CompareRow {
  methodId: string;
  title: string;
  complexity: string;
  timeMs: number;
  comparisons: number;
  swaps: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) return false;
  return (
    typeof value["id"] === "number" &&
    typeof value["cargo_type"] === "string" &&
    typeof value["distance_weight"] === "number" &&
    typeof value["price_weight"] === "number" &&
    typeof value["time_critical_weight"] === "number" &&
    typeof value["composite_score"] === "number"
  );
}

export function parseOrdersPayload(payload: string): ParseResult {
  try {
    const parsed: unknown = JSON.parse(payload);
    if (!Array.isArray(parsed)) return { ok: false, error: "Ожидался JSON-массив заказов" };
    const orders: Order[] = parsed.filter(isOrder);
    return { ok: true, orders };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "Неизвестная ошибка парсинга" };
  }
}

export function isSortMethodName(value: string): value is SortMethodName {
  return (
    value === "bubble_sort" ||
    value === "selection_sort" ||
    value === "insertion_sort" ||
    value === "shell_sort" ||
    value === "quick_sort" ||
    value === "merge_sort" ||
    value === "heap_sort"
  );
}

export function isSortKey(value: string): value is SortKey {
  return (
    value === "composite_score" ||
    value === "price_weight" ||
    value === "distance_weight" ||
    value === "time_critical_weight"
  );
}

export function isSortDirection(value: string): value is SortDirection {
  return value === "asc" || value === "desc";
}
