import { useCallback, useEffect, useState } from 'react';
import {
  fetchProducts,
  fetchStats,
  createProduct,
  updateProduct,
  deleteProduct,
} from './api/products.js';
import StatsBar from './components/StatsBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import ProductList from './components/ProductList.jsx';
import ProductForm from './components/ProductForm.jsx';

export default function App() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stock: '',
    sort: '-createdAt',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, product: null });

  const load = useCallback(async (currentFilters) => {
    try {
      setError('');
      const [productsData, statsData] = await Promise.all([
        fetchProducts(currentFilters),
        fetchStats(),
      ]);
      setProducts(productsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(filters), 300);
    return () => clearTimeout(timer);
  }, [filters, load]);

  const handleSave = async (formData, id) => {
    if (id) {
      await updateProduct(id, formData);
    } else {
      await createProduct(formData);
    }
    setFormState({ open: false, product: null });
    await load(filters);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product._id);
      await load(filters);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">StockFlow</h1>
            <p className="text-sm text-slate-400">Product inventory manager</p>
          </div>
          <button
            onClick={() => setFormState({ open: true, product: null })}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-400"
          >
            + Add Product
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {stats && <StatsBar stats={stats} />}

        <FilterBar filters={filters} onChange={setFilters} />

        <ProductList
          products={products}
          loading={loading}
          onEdit={(product) => setFormState({ open: true, product })}
          onDelete={handleDelete}
        />
      </main>

      {formState.open && (
        <ProductForm
          product={formState.product}
          onClose={() => setFormState({ open: false, product: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
