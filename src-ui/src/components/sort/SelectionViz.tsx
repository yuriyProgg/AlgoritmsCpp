import { SORT_KEYS, SPEEDS, SELECTION_METHOD } from "../../data/sortOptions.ts";
import { pseudoActiveLine } from "../../utils/sortUtils.ts";
import type { SelectionVizApi } from "../../hooks/useSelectionViz.ts";
import VizBar from "./VizBar.tsx";

const PSEUDOCODE: readonly string[] = [
  "for i in 0..n-1:",
  "  min = i",
  "  for j in i+1..n-1:",
  "    if a[j] < a[min]: min = j",
  "  swap(a[i], a[min])",
];

export interface SelectionVizProps {
  viz: SelectionVizApi;
}

export default function SelectionViz({ viz }: SelectionVizProps) {
  const current = viz.current;
  const activeLine: number = pseudoActiveLine(current?.phase ?? "init");
  const progressPct: number =
    viz.steps.length > 1 ? (viz.stepIndex / (viz.steps.length - 1)) * 100 : 0;

  return (
    <section
      ref={viz.vizRef}
      className="scroll-mt-4 rounded-2xl border border-violet-200 bg-white p-6 dark:border-violet-500/30 dark:bg-zinc-900"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-bold tracking-tight">Сортировка выбором</h2>
        <span className="rounded-full bg-violet-600 px-2 py-0.5 font-mono text-[11px] text-white">
          {SELECTION_METHOD}() · O(n²)
        </span>
        <span className="text-xs text-zinc-400">
          шаг {Math.min(viz.stepIndex + 1, viz.steps.length)} / {viz.steps.length}
        </span>
      </div>
      <p className="mt-1 max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">
        На каждом проходе <code className="font-mono">i</code> ищем минимум в неотсортированном
        суффиксе <code className="font-mono">[i..n-1]</code> и меняем его с позицией{" "}
        <code className="font-mono">i</code>. Префикс слева всегда отсортирован.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500">Поле:</span>
          <select
            value={viz.sortKey}
            onChange={viz.handleKeyChange}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {SORT_KEYS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500">Порядок:</span>
          <select
            value={viz.direction}
            onChange={viz.handleDirectionChange}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-zinc-500">Скорость:</span>
          <select
            value={String(viz.speedMs)}
            onChange={viz.handleSpeedChange}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {SPEEDS.map((s) => (
              <option key={s.ms} value={String(s.ms)}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={viz.handlePlayPause}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 active:scale-95"
        >
          {viz.isPlaying ? "Пауза" : "Старт"}
        </button>
        <button
          type="button"
          onClick={viz.handleStepBack}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:border-violet-400 hover:text-violet-600 active:scale-95 dark:border-zinc-700 dark:hover:text-violet-300"
        >
          ← Шаг
        </button>
        <button
          type="button"
          onClick={viz.handleStepForward}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:border-violet-400 hover:text-violet-600 active:scale-95 dark:border-zinc-700 dark:hover:text-violet-300"
        >
          Шаг →
        </button>
        <button
          type="button"
          onClick={viz.handleReset}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:border-violet-400 hover:text-violet-600 active:scale-95 dark:border-zinc-700 dark:hover:text-violet-300"
        >
          Сброс
        </button>
        <button
          type="button"
          onClick={viz.handleShuffle}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition hover:border-violet-400 hover:text-violet-600 active:scale-95 dark:border-zinc-700 dark:hover:text-violet-300"
        >
          Перемешать
        </button>
        <button
          type="button"
          onClick={viz.handleApplyResult}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 dark:bg-white dark:text-zinc-900"
        >
          Применить результат
        </button>
      </div>

      <div className="mt-4 flex items-start gap-1 overflow-x-auto rounded-xl border border-zinc-100 p-3 dark:border-zinc-800">
        {(current?.snapshot ?? []).map((order, idx) => (
          <VizBar
            key={`${order.id}-${idx}`}
            order={order}
            heightPct={viz.heights[idx] ?? 10}
            value={viz.valueFor(order)}
            state={viz.barStateFor(idx)}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2 font-mono text-xs">
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-600 dark:text-emerald-300">
          sorted: {current?.sortedCount ?? 0}
        </span>
        <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-violet-600 dark:text-violet-300">
          min = {current?.minIndex ?? -1}
        </span>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-600 dark:text-amber-300">
          j = {current?.scanIndex ?? -1}
        </span>
        <span className="rounded-full bg-zinc-500/10 px-2 py-0.5 text-zinc-500">
          сравнения: {current?.comparisons ?? 0} · обмены: {current?.swaps ?? 0}
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl bg-zinc-950 p-4 font-mono text-[13px] leading-6 text-zinc-200">
          {PSEUDOCODE.map((line, idx) => (
            <div
              key={idx}
              className={`rounded px-2 transition-colors ${
                idx === activeLine ? "bg-violet-600/80 text-white" : "text-zinc-400"
              }`}
            >
              {line}
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <p className="font-semibold">Текущий шаг</p>
          <p className="mt-1 min-h-10 text-zinc-600 dark:text-zinc-300">{current?.note ?? "—"}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-mono text-xs text-zinc-400">{Math.round(progressPct)}%</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-emerald-400" /> отсортировано
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-violet-500" /> кандидат min
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-amber-400" /> сравнение j
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-fuchsia-500" /> обмен
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
