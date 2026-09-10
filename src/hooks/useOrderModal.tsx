import { useState, useCallback } from 'react';
import type { Product } from '@/types';
import QuickOrderForm from '@/components/QuickOrderForm';
import { createPortal } from 'react-dom';
import { X, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export function useOrderModal() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOrder = useCallback((product: Product) => {
    if (!product.available) return;
    setSelectedProduct(product);
  }, []);

  const orderModal = selectedProduct
    ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-secondary-400 hover:bg-secondary-100 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-secondary-100">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 shrink-0">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-secondary-300" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-secondary-900">{selectedProduct.name}</h2>
                <p className="text-primary-600 font-semibold">{formatPrice(selectedProduct.price)}</p>
              </div>
            </div>
            <QuickOrderForm
              product={selectedProduct}
              onSuccess={() => setSelectedProduct(null)}
            />
          </div>
        </div>,
        document.body
      )
    : null;

  return { handleOrder, orderModal };
}
