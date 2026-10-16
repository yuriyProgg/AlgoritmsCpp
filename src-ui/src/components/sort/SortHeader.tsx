import type { ChangeEvent } from "react";

export interface SortHeaderProps {
  ordersCount: number;
  searchQuery: string;
  backendReady: boolean;
  backendError: string | null;
  loadingAlgo: string | null;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCompareAll: () => void;
}

export default function SortHeader({
  ordersCount,
  searchQuery,
  backendReady,
  backendError,
  loadingAlgo,
  onSearchChange,
  onCompareAll,
}: SortHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-violet-500/10 via-white to-fuchsia-500/10 p-6 dark:border-zinc-800 dark:from-violet-500/15 dark:via-zinc-900 dark:to-fuchsia-500/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Сортировки</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            7 методов класса <code className="font-mono">app::Sorter</code>.
            {backendReady ? (
              <span className="ml-2 font-medium text-emerald-600 dark:text-emerald-400">
                ● C++ бэкенд активен
              </span>
            ) : (
              <span className="ml-2 font-medium text-amber-600 dark:text-amber-400">
                ○ Режим отладки (браузер)
              </span>
            )}
          </p>
          {backendError !== null && (
            <p className="mt-1 text-xs text-red-500">Мост Qt: {backendError}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm backdrop-blur transition hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900">
          Заказов: {ordersCount}
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Поиск по типу груза или ID…"
          className="min-w-40 flex-1 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm outline-none backdrop-blur transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={onCompareAll}
          disabled={loadingAlgo !== null}
          className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:bg-violet-500 hover:shadow-violet-500/40 active:scale-95 disabled:opacity-50"
        >
          {loadingAlgo === "quick" ? "Сортировка..." : "Сравнить все"}
        </button>
      </div>
    </section>
  );
}
