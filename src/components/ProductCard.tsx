import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
  product: Product;
  onOrder?: (product: Product) => void;
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  return (
    <div className="group card overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-secondary-300" />
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-secondary-900 rounded-lg text-sm font-semibold">
              Indisponible
            </span>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-secondary-700">
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-secondary-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-secondary-500 line-clamp-2 mb-3 min-h-[2.5rem]">
          {product.description || 'Aucune description'}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/produit/${product.id}`}
            className="btn-outline flex-1 !py-2 text-xs"
          >
            <Eye className="w-4 h-4" />
            Voir
          </Link>
          <button
            onClick={() => onOrder?.(product)}
            disabled={!product.available}
            className="btn-primary flex-1 !py-2 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            Commander
          </button>
        </div>
      </div>
    </div>
  );
}
