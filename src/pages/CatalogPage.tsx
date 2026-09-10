import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '@/types';
import { fetchProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useOrderModal } from '@/hooks/useOrderModal';

type SortKey = 'recent' | 'price_asc' | 'price_desc' | 'name';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const { handleOrder, orderModal } = useOrderModal();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q)
      );
    }
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [products, query, category, sort]);

  const clearFilters = useCallback(() => {
    setQuery('');
    setCategory('');
    setSort('recent');
  }, []);

  const hasFilters = query || category || sort !== 'recent';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-secondary-50 border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-secondary-900 mb-2">Catalogue</h1>
          <p className="text-secondary-500">
            {loading ? 'Chargement...' : `${filtered.length} produit${filtered.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom..."
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
          <div className={`flex gap-3 ${showFilters ? 'flex-col' : 'hidden'} lg:flex`}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input lg:w-48"
            >
              <option value="">Toutes catégories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input lg:w-48"
            >
              <option value="recent">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name">Nom (A-Z)</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost">
                <X className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Chargement du catalogue..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Aucun produit trouvé"
            message="Essayez de modifier vos critères de recherche."
            actionLabel="Effacer les filtres"
            actionTo="/catalogue"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onOrder={handleOrder} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      {orderModal}
    </div>
  );
}
