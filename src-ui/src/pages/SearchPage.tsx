export default function SearchPage() {
  return (
    <div className="space-y-6">
      <section className="animate-pop rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <p className="mx-auto grid size-12 place-items-center rounded-2xl bg-zinc-900 text-xl text-white transition-transform duration-300 hover:rotate-6 hover:scale-110 dark:bg-white dark:text-zinc-900">
          ⌕
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Поиск</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
          Вкладка-заглушка без логики. Поле и фильтры ниже — только каркас с анимацией фокуса.
        </p>
        <div className="mx-auto mt-6 flex max-w-lg gap-2">
          <input
            placeholder="ID или поле заказа…"
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/15 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="button"
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-violet-600 active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-violet-400"
          >
            Найти
          </button>
        </div>
        <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2">
          {['По ID', 'По статусу', 'По дате'].map((f) => (
            <button
              key={f}
              type="button"
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400 hover:text-violet-600 hover:shadow-md active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-500 dark:hover:text-violet-300"
            >
              {f}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
