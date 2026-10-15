import type { SortAlgo } from '../data/algorithms.ts'

const BARS = [38, 72, 52, 92, 64, 84, 46, 78, 58, 95, 42, 68]

export default function AlgoCard({ algo, index }: { algo: SortAlgo; index: number }) {
  return (
    <article
      className="group animate-fade-up rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-400/60 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-500/50"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-300">
          {algo.title}
        </h3>
        <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 font-mono text-[11px] text-violet-600 dark:text-violet-300">
          {algo.complexity}
        </span>
      </div>
      <code className="mt-1 inline-block rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {algo.method}()
      </code>
      <p className="mt-2 min-h-10 text-sm text-zinc-500 dark:text-zinc-400">{algo.description}</p>
      <div className="mt-3 flex h-14 items-end gap-1 overflow-hidden rounded-xl bg-zinc-50 p-2 dark:bg-zinc-950/60">
        {BARS.map((h, i) => (
          <span
            key={i}
            className="w-full origin-bottom animate-bar rounded-sm bg-gradient-to-t from-violet-500/70 to-fuchsia-400/70 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-400"
            style={{ height: `${h}%`, animationDelay: `${(i + index) * 120}ms` }}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-violet-600 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-violet-400"
        >
          Запустить
        </button>
        <button
          type="button"
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm transition-all duration-300 hover:border-violet-400 hover:text-violet-600 active:scale-95 dark:border-zinc-700 dark:hover:border-violet-500 dark:hover:text-violet-300"
        >
          Шаги
        </button>
      </div>
    </article>
  )
}
