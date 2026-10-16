import { SORT_ALGOS, SORT_GROUPS } from "../../data/algorithms.ts";
import type { SortAlgo } from "../../data/algorithms.ts";
import AlgoCard from "../AlgoCard.tsx";

export interface AlgoGroupsProps {
  activeId?: string;
  onSelectAlgo: (algo: SortAlgo) => void;
}

export default function AlgoGroups({ activeId, onSelectAlgo }: AlgoGroupsProps) {
  return (
    <>
      {SORT_GROUPS.map((group) => {
        const items: SortAlgo[] = SORT_ALGOS.filter((a) => a.group === group.id);
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
                <div
                  key={algo.id}
                  onClick={() => onSelectAlgo(algo)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSelectAlgo(algo);
                  }}
                  role="button"
                  tabIndex={0}
                  className={`cursor-pointer rounded-2xl transition ${algo.id === activeId ? "ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-950" : ""}`}
                >
                  <AlgoCard algo={algo} index={i} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
