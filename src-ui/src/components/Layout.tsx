import { NavLink, Outlet, useLocation } from 'react-router-dom'

const linkBase =
  'relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95'

export default function Layout() {
  const location = useLocation()
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg text-white shadow-lg shadow-violet-500/25 transition-transform duration-300 hover:rotate-6 hover:scale-105">
              ∑
            </span>
            <div className="leading-tight">
              <p className="font-semibold tracking-tight">AlgorithmsCpp</p>
              <p className="text-xs text-zinc-500">Сортировки · Поиск</p>
            </div>
          </div>
          <nav className="ml-auto flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100/80 p-1 dark:border-zinc-800 dark:bg-zinc-900">
            <NavLink
              to="/sort"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`
              }
            >
              Сортировки
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`
              }
            >
              Поиск
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div key={location.pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800">
        UI без логики · данные из <code className="font-mono">src/algoritms/sorter.h</code>
      </footer>
    </div>
  )
}
