import type { AppliedInfo, CompareRow } from "../../types/sort.ts";

export interface SortReportProps {
  applied: AppliedInfo | null;
  comparison: readonly CompareRow[] | null;
}

function formatMs(value: number): string {
  return value < 0.05 ? "<0.05" : value.toFixed(2);
}

function formatCount(value: number | null): string {
  return value === null ? "—" : String(value);
}

export default function SortReport({ applied, comparison }: SortReportProps) {
  if (applied === null && comparison === null) return null;
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {applied !== null && (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Применён метод: <span className="font-semibold text-zinc-900 dark:text-white">{applied.title}</span>
          <span className="ml-2 rounded-full bg-violet-500/10 px-2 py-0.5 font-mono text-[11px] text-violet-600 dark:text-violet-300">
            {applied.source}
          </span>
          <span className="ml-2 font-mono text-xs text-zinc-400">
            сравнений: {formatCount(applied.comparisons)} · перестановок: {formatCount(applied.swaps)} · время: {applied.timeMs === null ? "—" : `${formatMs(applied.timeMs)} мс`}
          </span>
        </p>
      )}
      {comparison !== null && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
            <thead className="border-b border-zinc-200 font-mono text-xs uppercase dark:border-zinc-800">
              <tr>
                <th className="p-3">Метод</th>
                <th className="p-3">Сложность</th>
                <th className="p-3">Время, мс</th>
                <th className="p-3">Сравнения</th>
                <th className="p-3">Перестановки</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {comparison.map((row) => (
                <tr key={row.methodId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-3 font-medium">{row.title}</td>
                  <td className="p-3 font-mono text-xs">{row.complexity}</td>
                  <td className="p-3 font-mono">{formatMs(row.timeMs)}</td>
                  <td className="p-3 font-mono">{row.comparisons}</td>
                  <td className="p-3 font-mono">{row.swaps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
