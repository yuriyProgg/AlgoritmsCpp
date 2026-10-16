import type { Order } from "../../types/sort.ts";

export type VizBarState = "sorted" | "min" | "scan" | "swapped" | "plain";

export interface VizBarProps {
  order: Order;
  heightPct: number;
  value: number;
  state: VizBarState;
}

const PALETTE: Record<VizBarState, string> = {
  sorted: "from-emerald-500/80 to-emerald-300/80 border-emerald-400/60",
  min: "from-violet-600 to-fuchsia-400 border-violet-300 shadow-lg shadow-violet-500/40",
  scan: "from-amber-500 to-orange-300 border-amber-300 shadow-lg shadow-amber-500/30",
  swapped: "from-fuchsia-600 to-pink-400 border-fuchsia-300 shadow-lg shadow-fuchsia-500/40",
  plain: "from-zinc-400/70 to-zinc-300/70 border-zinc-300/50 dark:from-zinc-600/80 dark:to-zinc-500/60",
};

export default function VizBar({ order, heightPct, value, state }: VizBarProps) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center gap-1"
      title={`ID ${order.id}: ${value}`}
    >
      <span className="font-mono text-[10px] leading-none text-zinc-500 dark:text-zinc-400">
        {Number.isInteger(value) ? value : value.toFixed(1)}
      </span>
      <div className="flex h-40 w-full items-end rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800/60">
        <div
          className={`w-full rounded-md border bg-gradient-to-t transition-all duration-300 ${PALETTE[state]}`}
          style={{ height: `${heightPct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] leading-none text-zinc-500 dark:text-zinc-400">
        #{order.id}
      </span>
    </div>
  );
}
