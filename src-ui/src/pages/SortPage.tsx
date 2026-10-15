import { SORT_ALGOS, SORT_GROUPS } from '../data/algorithms.ts'
import AlgoCard from '../components/AlgoCard.tsx'

export default function SortPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-violet-500/10 via-white to-fuchsia-500/10 p-6 dark:border-zinc-800 dark:from-violet-500/15 dark:via-zinc-900 dark:to-fuchsia-500/10">
        <h1 className="text-2xl font-bold tracking-tight">Сортировки</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          7 методов класса <code className="font-mono">app::Sorter</code>. Панель ниже — только каркас, без логики.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm backdrop-blur transition hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900">
            Заказов: 25
          </span>
          <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 font-mono text-sm backdrop-blur transition hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900">
            dataset: Order[]
          </span>
          <input
            placeholder="Поиск по списку…"
            className="min-w-40 flex-1 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm outline-none backdrop-blur transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="button"
            className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:bg-violet-500 hover:shadow-violet-500/40 active:scale-95"
          >
            Сравнить все
          </button>
        </div>
      </section>

      {SORT_GROUPS.map((group) => {
        const items = SORT_ALGOS.filter((a) => a.group === group.id)
        return (
          <section key={group.id}>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-semibold tracking-tight">{group.title}</h2>
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-white dark:bg-white dark:text-zinc-900">
                {group.badge}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
              <span className="text-xs text-zinc-400">{items.length}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((algo, i) => (
                <AlgoCard key={algo.id} algo={algo} index={i} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
