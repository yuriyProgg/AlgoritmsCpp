import type { Order, SelectionPhase, SelectionStep, SortDirection, SortKey } from "../types/sort.ts";

export function orderKeyValue(order: Order, key: SortKey): number {
  return order[key];
}

function isBetter(candidate: number, current: number, dir: SortDirection): boolean {
  return dir === "asc" ? candidate < current : candidate > current;
}

export function cloneOrders(orders: readonly Order[]): Order[] {
  return orders.map((o) => ({ ...o }));
}

export function shuffleOrders(orders: readonly Order[]): Order[] {
  const arr: Order[] = cloneOrders(orders);
  for (let i: number = arr.length - 1; i > 0; i -= 1) {
    const j: number = Math.floor(Math.random() * (i + 1));
    const tmp: Order = arr[i] as Order;
    arr[i] = arr[j] as Order;
    arr[j] = tmp as Order;
  }
  return arr;
}

export function normalizeHeights(orders: readonly Order[], key: SortKey): number[] {
  if (orders.length === 0) return [];
  const values: number[] = orders.map((o) => orderKeyValue(o, key));
  const min: number = Math.min(...values);
  const max: number = Math.max(...values);
  if (max === min) return values.map(() => 62);
  return values.map((v) => 12 + ((v - min) / (max - min)) * 88);
}

export function buildSelectionSteps(
  input: readonly Order[],
  key: SortKey,
  dir: SortDirection,
): SelectionStep[] {
  const arr: Order[] = cloneOrders(input);
  const steps: SelectionStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n: number = arr.length;

  const push = (step: Omit<SelectionStep, "comparisons" | "swaps">): void => {
    steps.push({ ...step, comparisons, swaps });
  };

  push({
    snapshot: cloneOrders(arr),
    pass: 0,
    sortedCount: 0,
    minIndex: n > 0 ? 0 : -1,
    scanIndex: -1,
    comparedPair: null,
    swappedPair: null,
    phase: "init",
    note: `Начало: ищем минимум по полю «${key}» (${dir === "asc" ? "по возрастанию" : "по убыванию"}).`,
  });

  for (let i: number = 0; i < n; i += 1) {
    let minIdx: number = i;
    for (let j: number = i + 1; j < n; j += 1) {
      comparisons += 1;
      const candidate: number = orderKeyValue(arr[j] as Order, key);
      const current: number = orderKeyValue(arr[minIdx] as Order, key);
      if (isBetter(candidate, current, dir)) {
        minIdx = j;
        push({
          snapshot: cloneOrders(arr),
          pass: i,
          sortedCount: i,
          minIndex: minIdx,
          scanIndex: j,
          comparedPair: [minIdx, j],
          swappedPair: null,
          phase: "new_min",
          note: `Проход ${i + 1}: позиция j=${j} (${candidate}) — новый минимум, запоминаем.`,
        });
      } else {
        push({
          snapshot: cloneOrders(arr),
          pass: i,
          sortedCount: i,
          minIndex: minIdx,
          scanIndex: j,
          comparedPair: [minIdx, j],
          swappedPair: null,
          phase: "compare",
          note: `Проход ${i + 1}: сравниваем j=${j} (${candidate}) с min=${minIdx} (${current}) — минимум не меняется.`,
        });
      }
    }
    if (minIdx !== i) {
      const tmp: Order = arr[i] as Order;
      arr[i] = arr[minIdx] as Order;
      arr[minIdx] = tmp as Order;
      swaps += 1;
      push({
        snapshot: cloneOrders(arr),
        pass: i,
        sortedCount: i + 1,
        minIndex: i,
        scanIndex: minIdx,
        comparedPair: null,
        swappedPair: [i, minIdx],
        phase: "swap",
        note: `Проход ${i + 1}: меняем i=${i} с min=${minIdx}. Граница отсортированного префикса → ${i + 1}.`,
      });
    } else {
      push({
        snapshot: cloneOrders(arr),
        pass: i,
        sortedCount: i + 1,
        minIndex: i,
        scanIndex: -1,
        comparedPair: null,
        swappedPair: null,
        phase: "pass_done",
        note: `Проход ${i + 1}: минимум уже на месте (i=${i}). Обмен не нужен.`,
      });
    }
  }

  push({
    snapshot: cloneOrders(arr),
    pass: n,
    sortedCount: n,
    minIndex: -1,
    scanIndex: -1,
    comparedPair: null,
    swappedPair: null,
    phase: "done",
    note: `Готово: ${comparisons} сравнений, ${swaps} обменов. Сложность O(n²).`,
  });

  return steps;
}

export function pseudoActiveLine(phase: SelectionPhase): number {
  switch (phase) {
    case "init": return 0;
    case "compare": return 3;
    case "new_min": return 3;
    case "swap": return 4;
    case "pass_done": return 4;
    case "done": return 4;
  }
}
