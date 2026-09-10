import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, X, Package, Tag, Layers } from 'lucide-react';
import type { Product } from '@/types';
import { fetchProductById } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderForm from '@/components/OrderForm';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    fetchProductById(id)
      .then((p) => {
        if (!p) setNotFound(true);
        setProduct(p);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-secondary-500 hover:text-secondary-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {loading ? (
          <LoadingSpinner message="Chargement du produit..." />
        ) : notFound || !product ? (
          <EmptyState
            title="Produit introuvable"
            message="Ce produit n'existe pas ou n'est plus disponible."
            actionLabel="Voir le catalogue"
            actionTo="/catalogue"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary-50 card">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-secondary-300" />
                  </div>
                )}
              </div>
              {!product.available && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-error-500 text-white rounded-lg text-sm font-semibold shadow-lg">
                  Produit indisponible
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {product.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium w-fit mb-3">
                  <Tag className="w-3 h-3" />
                  {product.category}
                </span>
              )}
              <h1 className="font-display text-3xl font-bold text-secondary-900 mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary-600 mb-6">{formatPrice(product.price)}</p>

              <div className="mb-6">
                <h2 className="text-sm font-semibold text-secondary-700 uppercase tracking-wider mb-2">Description</h2>
                <p className="text-secondary-600 leading-relaxed">
                  {product.description || 'Aucune description disponible.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card p-4">
                  <div className="flex items-center gap-2 text-secondary-500 text-sm mb-1">
                    <Package className="w-4 h-4" />
                    Disponibilité
                  </div>
                  <p className={`font-semibold ${product.available ? 'text-success-600' : 'text-error-500'}`}>
                    {product.available ? 'En stock' : 'Indisponible'}
                  </p>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-2 text-secondary-500 text-sm mb-1">
                    <Layers className="w-4 h-4" />
                    Catégorie
                  </div>
                  <p className="font-semibold text-secondary-800">{product.category || 'Non classé'}</p>
                </div>
              </div>

              {product.available ? (
                <OrderForm product={product} />
              ) : (
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-error-100 flex items-center justify-center mb-3">
                    <X className="w-6 h-6 text-error-500" />
                  </div>
                  <p className="font-semibold text-secondary-800 mb-1">Produit indisponible</p>
                  <p className="text-sm text-secondary-500 mb-4">
                    Ce produit est actuellement en rupture de stock.
                  </p>
                  <Link to="/catalogue" className="btn-secondary">
                    Voir d'autres produits
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
