const money = (n) => `$${Number(n).toFixed(2)}`;

const badgeStyles = {
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  low: 'border-amber-200 bg-amber-50 text-amber-700',
  out: 'border-red-200 bg-red-50 text-red-700',
};

const badgeLabels = {
  ok: 'In stock',
  low: 'Low stock',
  out: 'Out of stock',
};

const headCell = 'px-4 py-3 font-semibold';

export default function ProductList({ products, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading products…
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-700">No products found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try different filters, or add a new product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className={headCell}>Product</th>
            <th className={headCell}>Category</th>
            <th className={headCell}>Quantity</th>
            <th className={headCell}>Price</th>
            <th className={headCell}>Stock value</th>
            <th className={headCell}>Status</th>
            <th className={`${headCell} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{product.name}</p>
                {product.description && (
                  <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                    {product.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">{product.category}</td>
              <td className="px-4 py-3 text-slate-600">{product.quantity}</td>
              <td className="px-4 py-3 text-slate-600">{money(product.price)}</td>
              <td className="px-4 py-3 text-slate-600">{money(product.stockValue)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeStyles[product.stockStatus]}`}
                >
                  {badgeLabels[product.stockStatus]}
                </span>
              </td>
              <td className="space-x-2 px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(product)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
