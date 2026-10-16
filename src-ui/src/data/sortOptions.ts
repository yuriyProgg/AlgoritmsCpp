import type { Order, SortKey, SortMethodName } from "../types/sort.ts";

export const MOCK_ORDERS: readonly Order[] = [
  { id: 1, cargo_type: "Хрупкий груз", distance_weight: 120.5, price_weight: 500, time_critical_weight: 10, composite_score: 85.4 },
  { id: 2, cargo_type: "Срочная доставка", distance_weight: 45.0, price_weight: 1200, time_critical_weight: 95, composite_score: 92.1 },
  { id: 3, cargo_type: "Стандартный контейнер", distance_weight: 300.0, price_weight: 300, time_critical_weight: 20, composite_score: 64.8 },
  { id: 4, cargo_type: "Опасный груз", distance_weight: 85.0, price_weight: 890, time_critical_weight: 80, composite_score: 88.9 },
  { id: 5, cargo_type: "Холодная цепь", distance_weight: 210.0, price_weight: 750, time_critical_weight: 60, composite_score: 79.3 },
];

export const SORT_KEYS: readonly { id: SortKey; title: string }[] = [
  { id: "composite_score", title: "Composite score" },
  { id: "price_weight", title: "Цена" },
  { id: "distance_weight", title: "Дистанция" },
  { id: "time_critical_weight", title: "Критичность" },
];

export const SPEEDS: readonly { ms: number; title: string }[] = [
  { ms: 900, title: "0.9x" },
  { ms: 450, title: "1x" },
  { ms: 180, title: "2x" },
];

export const SELECTION_METHOD: SortMethodName = "selection_sort";
