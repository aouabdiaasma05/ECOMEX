import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, Order } from '@/types';
import { createOrder } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import OrderSuccessModal from '@/components/OrderSuccessModal';

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane',
];

interface OrderFormProps {
  product: Product;
  onSuccess?: (order: Order) => void;
}

export default function OrderForm({ product, onSuccess }: OrderFormProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    wilaya: '',
    commune: '',
    address: '',
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  const total = product.price * quantity;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.customer_name.trim()) e.customer_name = 'Le nom est requis';
    if (!form.phone.trim()) e.phone = 'Le téléphone est requis';
    else if (!/^[0-9+\s-]{8,}$/.test(form.phone.trim())) e.phone = 'Numéro invalide';
    if (!form.address.trim()) e.address = "L'adresse est requise";
    if (quantity < 1) e.quantity = 'La quantité doit être au moins 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        wilaya: form.wilaya || null,
        commune: form.commune.trim() || null,
        address: form.address.trim(),
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price: product.price,
        total_price: total,
        note: form.note.trim() || null,
      });
      setSuccessOrder(order);
      onSuccess?.(order);
    } catch {
      setServerError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  return (
    <div className="card p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-primary-600" />
        <h2 className="font-display text-xl font-bold text-secondary-900">Passer commande</h2>
      </div>

      {/* Product summary */}
      <div className="flex items-center gap-4 bg-secondary-50 rounded-lg p-4 mb-6">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 shrink-0">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-secondary-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-secondary-900 truncate">{product.name}</p>
          <p className="text-sm text-primary-600 font-semibold">{formatPrice(product.price)}</p>
        </div>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-error-50 border border-error-100 text-error-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Nom et prénom <span className="text-error-500">*</span></label>
            <input
              type="text"
              value={form.customer_name}
              onChange={(e) => update('customer_name', e.target.value)}
              className="input"
              placeholder="Votre nom complet"
            />
            {errors.customer_name && <p className="text-xs text-error-500 mt-1">{errors.customer_name}</p>}
          </div>
          <div>
            <label className="label">Téléphone <span className="text-error-500">*</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="input"
              placeholder="06 00 00 00 00"
            />
            {errors.phone && <p className="text-xs text-error-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Wilaya</label>
            <select
              value={form.wilaya}
              onChange={(e) => update('wilaya', e.target.value)}
              className="input"
            >
              <option value="">Sélectionner...</option>
              {WILAYAS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Commune</label>
            <input
              type="text"
              value={form.commune}
              onChange={(e) => update('commune', e.target.value)}
              className="input"
              placeholder="Votre commune"
            />
          </div>
        </div>

        <div>
          <label className="label">Adresse <span className="text-error-500">*</span></label>
          <textarea
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            className="input min-h-[80px] resize-y"
            placeholder="Votre adresse complète"
          />
          {errors.address && <p className="text-xs text-error-500 mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Quantité <span className="text-error-500">*</span></label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg border border-secondary-200 flex items-center justify-center text-secondary-600 hover:bg-secondary-50 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="input text-center w-20"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-lg border border-secondary-200 flex items-center justify-center text-secondary-600 hover:bg-secondary-50 transition-colors"
              >
                +
              </button>
            </div>
            {errors.quantity && <p className="text-xs text-error-500 mt-1">{errors.quantity}</p>}
          </div>
          <div className="flex flex-col justify-end">
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <div className="flex items-center justify-between text-sm text-secondary-600 mb-1">
                <span>{formatPrice(product.price)} × {quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-700">Total</span>
                <span className="text-xl font-bold text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="label">Remarque (facultatif)</label>
          <textarea
            value={form.note}
            onChange={(e) => update('note', e.target.value)}
            className="input min-h-[60px] resize-y"
            placeholder="Une remarque concernant votre commande..."
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Confirmer la commande'
          )}
        </button>
      </form>

      <OrderSuccessModal
        open={!!successOrder}
        orderNumber={successOrder?.order_number ?? ''}
        onClose={() => {
          setSuccessOrder(null);
          navigate('/catalogue');
        }}
      />
    </div>
  );
}
