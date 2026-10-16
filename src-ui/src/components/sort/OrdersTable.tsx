import type { Order } from "../../types/sort.ts";

export interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) return null;
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-lg font-semibold">
        Результаты выборки ({orders.length})
      </h3>
      <div className="max-h-96 overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="border-b border-zinc-200 bg-zinc-50 font-mono text-xs uppercase dark:border-zinc-800 dark:bg-zinc-800/50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Тип груза</th>
              <th className="p-3">Дистанция</th>
              <th className="p-3">Цена</th>
              <th className="p-3">Критичность</th>
              <th className="p-3">Composite Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.slice(0, 50).map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="p-3 font-mono">{order.id}</td>
                <td className="p-3 font-medium">{order.cargo_type}</td>
                <td className="p-3">{order.distance_weight}</td>
                <td className="p-3">{order.price_weight}</td>
                <td className="p-3">{order.time_critical_weight}</td>
                <td className="p-3 font-mono font-bold text-violet-600 dark:text-violet-400">
                  {order.composite_score.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
