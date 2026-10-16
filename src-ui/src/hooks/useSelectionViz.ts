import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import type { Order, SelectionStep, SortDirection, SortKey } from "../types/sort.ts";
import { isSortDirection, isSortKey } from "../types/sort.ts";
import { buildSelectionSteps, cloneOrders, normalizeHeights, orderKeyValue, shuffleOrders } from "../utils/sortUtils.ts";
import type { VizBarState } from "../components/sort/VizBar.tsx";

export interface SelectionVizApi {
  sortKey: SortKey;
  direction: SortDirection;
  speedMs: number;
  stepIndex: number;
  isPlaying: boolean;
  steps: SelectionStep[];
  current: SelectionStep | undefined;
  heights: number[];
  vizRef: RefObject<HTMLDivElement | null>;
  barStateFor: (idx: number) => VizBarState;
  valueFor: (order: Order) => number;
  handleKeyChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleDirectionChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleSpeedChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handlePlayPause: () => void;
  handleStepForward: () => void;
  handleStepBack: () => void;
  handleReset: () => void;
  handleShuffle: () => void;
  handleApplyResult: () => void;
  startFromTop: () => void;
  resetToStart: () => void;
}

export function useSelectionViz(
  orders: Order[],
  setOrders: Dispatch<SetStateAction<Order[]>>,
): SelectionVizApi {
  const [sortKey, setSortKey] = useState<SortKey>("composite_score");
  const [direction, setDirection] = useState<SortDirection>("asc");
  const [speedMs, setSpeedMs] = useState<number>(450);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const vizRef = useRef<HTMLDivElement | null>(null);

  const steps: SelectionStep[] = useMemo(
    () => buildSelectionSteps(orders, sortKey, direction),
    [orders, sortKey, direction],
  );

  const current: SelectionStep | undefined = steps[stepIndex];
  const heights: number[] = useMemo(
    () => normalizeHeights(current?.snapshot ?? [], sortKey),
    [current, sortKey],
  );

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer: number = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, speedMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length, speedMs]);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [sortKey, direction, orders.length]);

  const handleKeyChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (isSortKey(event.target.value)) setSortKey(event.target.value);
  };

  const handleDirectionChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    if (isSortDirection(event.target.value)) setDirection(event.target.value);
  };

  const handleSpeedChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const parsed: number = Number.parseInt(event.target.value, 10);
    if (Number.isFinite(parsed) && parsed > 0) setSpeedMs(parsed);
  };

  const handlePlayPause = (): void => {
    if (current?.phase === "done" && !isPlaying) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleStepForward = (): void => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBack = (): void => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = (): void => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const handleShuffle = (): void => {
    setIsPlaying(false);
    setOrders((prev) => shuffleOrders(prev));
  };

  const handleApplyResult = (): void => {
    const last: SelectionStep | undefined = steps[steps.length - 1];
    if (last !== undefined) {
      setOrders(cloneOrders(last.snapshot));
      setStepIndex(0);
      setIsPlaying(false);
    }
  };

  const startFromTop = (): void => {
    vizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsPlaying(true);
  };

  const resetToStart = (): void => {
    setStepIndex(0);
    setIsPlaying(false);
  };

  const barStateFor = (idx: number): VizBarState => {
    if (current === undefined) return "plain";
    if (current.swappedPair !== null && (current.swappedPair[0] === idx || current.swappedPair[1] === idx)) {
      return "swapped";
    }
    if (idx < current.sortedCount) return "sorted";
    if (idx === current.minIndex) return "min";
    if (idx === current.scanIndex) return "scan";
    return "plain";
  };

  const valueFor = (order: Order): number => orderKeyValue(order, sortKey);

  return {
    sortKey, direction, speedMs, stepIndex, isPlaying, steps, current, heights, vizRef,
    barStateFor, valueFor,
    handleKeyChange, handleDirectionChange, handleSpeedChange,
    handlePlayPause, handleStepForward, handleStepBack, handleReset,
    handleShuffle, handleApplyResult, startFromTop, resetToStart,
  };
}
