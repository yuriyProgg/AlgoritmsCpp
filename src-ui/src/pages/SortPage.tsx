import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { SORT_ALGOS } from "../data/algorithms.ts";
import type { SortAlgo } from "../data/algorithms.ts";
import { MOCK_ORDERS } from "../data/sortOptions.ts";
import type { AppliedInfo, CompareRow, Order, SortMethodName } from "../types/sort.ts";
import { isSortMethodName } from "../types/sort.ts";
import { cloneOrders } from "../utils/sortUtils.ts";
import { runLocalSort } from "../utils/sorts.ts";
import { useSorterBackend } from "../hooks/useSorterBackend.ts";
import { useSelectionViz } from "../hooks/useSelectionViz.ts";
import SortHeader from "../components/sort/SortHeader.tsx";
import SelectionViz from "../components/sort/SelectionViz.tsx";
import AlgoGroups from "../components/sort/AlgoGroups.tsx";
import SortReport from "../components/sort/SortReport.tsx";
import OrdersTable from "../components/sort/OrdersTable.tsx";

export default function SortPage() {
  const [orders, setOrders] = useState<Order[]>(() => cloneOrders(MOCK_ORDERS));
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [applied, setApplied] = useState<AppliedInfo | null>(null);
  const [comparison, setComparison] = useState<CompareRow[] | null>(null);

  const viz = useSelectionViz(orders, setOrders);
  const pendingRef = useRef<{ id: string; title: string } | null>(null);
  const backend = useSorterBackend((next: Order[]) => {
    setOrders(next);
    viz.resetToStart();
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (pending !== null) {
      setApplied({
        methodId: pending.id,
        title: pending.title,
        source: "C++",
        comparisons: null,
        swaps: null,
        timeMs: null,
      });
    }
  });

  const applyLocal = (algo: SortAlgo, method: SortMethodName): void => {
    const result = runLocalSort(orders, method, viz.sortKey, viz.direction);
    setOrders(result.sorted);
    viz.resetToStart();
    setApplied({
      methodId: algo.id,
      title: algo.title,
      source: "локально (JS)",
      comparisons: result.comparisons,
      swaps: result.swaps,
      timeMs: result.timeMs,
    });
  };

  const handleSelectAlgo = (algo: SortAlgo): void => {
    const method: string = algo.method;
    if (!isSortMethodName(method)) return;
    if (algo.id === "selection") {
      viz.startFromTop();
      return;
    }
    pendingRef.current = { id: algo.id, title: algo.title };
    backend.runMethod(method, algo.id, () => {
      pendingRef.current = null;
      applyLocal(algo, method);
    });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleCompareAll = (): void => {
    pendingRef.current = null;
    const rows: CompareRow[] = [];
    for (const algo of SORT_ALGOS) {
      if (!isSortMethodName(algo.method)) continue;
      const result = runLocalSort(orders, algo.method, viz.sortKey, viz.direction);
      rows.push({
        methodId: algo.id,
        title: algo.title,
        complexity: algo.complexity,
        timeMs: result.timeMs,
        comparisons: result.comparisons,
        swaps: result.swaps,
      });
    }
    setComparison(rows);
    const quick = runLocalSort(orders, "quick_sort", viz.sortKey, viz.direction);
    setOrders(quick.sorted);
    viz.resetToStart();
    setApplied({
      methodId: "quick",
      title: "Быстрая",
      source: "локально (JS)",
      comparisons: quick.comparisons,
      swaps: quick.swaps,
      timeMs: quick.timeMs,
    });
  };

  const filteredOrders: Order[] = useMemo(() => {
    const q: string = searchQuery.trim().toLowerCase();
    const source: Order[] = viz.current?.snapshot ?? orders;
    if (q.length === 0) return source;
    return source.filter(
      (o) => o.cargo_type.toLowerCase().includes(q) || o.id.toString().includes(q),
    );
  }, [searchQuery, viz.current, orders]);

  return (
    <div className="space-y-8">
      <SortHeader
        ordersCount={orders.length}
        searchQuery={searchQuery}
        backendReady={backend.backendReady}
        backendError={backend.backendError}
        loadingAlgo={backend.loadingAlgo}
        onSearchChange={handleSearchChange}
        onCompareAll={handleCompareAll}
      />
      <SelectionViz viz={viz} />
      <AlgoGroups activeId="selection" onSelectAlgo={handleSelectAlgo} />
      <SortReport applied={applied} comparison={comparison} />
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
