import { useEffect, useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Package as PackageIcon } from 'lucide-react';
import type { Product } from '@/types';
import { fetchProducts, deleteProduct } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import AdminLayout from '@/components/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import ProductForm from '@/components/ProductForm';

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [, setDeleting] = useState(false);

  const load = () => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.category ?? '').toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // keep product on failure
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    load();
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Chargement des produits..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">Gestion des produits</h1>
          <p className="text-sm text-secondary-500 mt-1">{products.length} produit{products.length > 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="input pl-10 max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={PackageIcon}
          title={search ? "Aucun produit trouvé" : "Aucun produit"}
          message={search ? "Modifiez votre recherche." : "Commencez par ajouter votre premier produit."}
          actionLabel={search ? undefined : "Ajouter un produit"}
          actionTo={undefined}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 text-secondary-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Produit</th>
                  <th className="text-left px-5 py-3 font-medium">Catégorie</th>
                  <th className="text-left px-5 py-3 font-medium">Prix</th>
                  <th className="text-center px-5 py-3 font-medium">Disponibilité</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-100 shrink-0">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PackageIcon className="w-5 h-5 text-secondary-300" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-secondary-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-secondary-600">{p.category || '—'}</td>
                    <td className="px-5 py-3 font-semibold text-secondary-800">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`badge ${p.available ? 'bg-success-100 text-success-700 border-success-200' : 'bg-error-100 text-error-700 border-error-200'}`}>
                        {p.available ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingProduct(p); setShowForm(true); }}
                          className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 rounded-lg text-error-500 hover:bg-error-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile grid */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="card p-4 flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PackageIcon className="w-6 h-6 text-secondary-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-800 truncate">{p.name}</p>
                  <p className="text-sm text-secondary-500">{p.category || '—'}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-primary-600">{formatPrice(p.price)}</span>
                    <span className={`badge ${p.available ? 'bg-success-100 text-success-700 border-success-200' : 'bg-error-100 text-error-700 border-error-200'}`}>
                      {p.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { setEditingProduct(p); setShowForm(true); }}
                      className="btn-outline flex-1 !py-2 text-xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Modifier
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="btn-danger !py-2 !px-3 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer ce produit ?"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteTarget?.name}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
