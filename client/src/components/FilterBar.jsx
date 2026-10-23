import { CATEGORIES } from '../api/products.js';

const selectClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

export default function FilterBar({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        value={filters.search}
        onChange={set('search')}
        placeholder="Search products…"
        className={`w-full sm:flex-1 ${selectClass}`}
      />
      <select value={filters.category} onChange={set('category')} className={selectClass}>
        <option value="">All categories</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select value={filters.stock} onChange={set('stock')} className={selectClass}>
        <option value="">All stock</option>
        <option value="in">In stock</option>
        <option value="out">Out of stock</option>
      </select>
      <select value={filters.sort} onChange={set('sort')} className={selectClass}>
        <option value="-createdAt">Newest</option>
        <option value="name">Name A–Z</option>
        <option value="price">Price: low to high</option>
        <option value="-price">Price: high to low</option>
        <option value="-quantity">Quantity: high to low</option>
      </select>
    </div>
  );
}
