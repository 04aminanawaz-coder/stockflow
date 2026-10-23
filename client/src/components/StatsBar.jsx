export default function StatsBar({ stats }) {
  const cards = [
    { label: 'Total products', value: stats.totalProducts },
    { label: 'Units in stock', value: stats.totalUnits },
    {
      label: 'Inventory value',
      value: `$${Number(stats.inventoryValue).toLocaleString()}`,
    },
    { label: 'Low stock items', value: stats.lowStockCount },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {stats.byCategory && stats.byCategory.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {stats.byCategory.map((item) => (
            <span
              key={item.category}
              className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {item.category} · {item.count}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
