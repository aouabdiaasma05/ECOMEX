import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Package, ShoppingBag, Clock, FileText, User } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { fetchOrders, updateOrderStatus } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_DOT } from '@/types';
import AdminLayout from '@/components/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

const ALL_STATUSES: OrderStatus[] = ['new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders()
      .then((orders) => {
        const found = orders.find((o) => o.id === id);
        setOrder(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    const prevStatus = order.status;
    setOrder({ ...order, status });
    try {
      await updateOrderStatus(order.id, status);
    } catch {
      setOrder({ ...order, status: prevStatus });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Chargement de la commande..." />
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <EmptyState
          title="Commande introuvable"
          message="Cette commande n'existe pas."
          actionLabel="Voir toutes les commandes"
          actionTo="/admin/orders"
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-secondary-500 hover:text-secondary-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Customer info */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary-600" />
              <h2 className="font-display text-lg font-semibold text-secondary-900">Informations client</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary-400 text-xs mb-0.5">Nom</p>
                <p className="font-medium text-secondary-800">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-secondary-400 text-xs mb-0.5">Téléphone</p>
                <a href={`tel:${order.phone}`} className="font-medium text-primary-600 hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {order.phone}
                </a>
              </div>
              <div>
                <p className="text-secondary-400 text-xs mb-0.5">Wilaya</p>
                <p className="font-medium text-secondary-800">{order.wilaya || '—'}</p>
              </div>
              <div>
                <p className="text-secondary-400 text-xs mb-0.5">Commune</p>
                <p className="font-medium text-secondary-800">{order.commune || '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-secondary-400 text-xs mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Adresse
                </p>
                <p className="font-medium text-secondary-800">{order.address}</p>
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary-600" />
              <h2 className="font-display text-lg font-semibold text-secondary-900">Produit</h2>
            </div>
            <div className="flex items-center gap-4 bg-secondary-50 rounded-lg p-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 shrink-0 flex items-center justify-center">
                {order.product_id ? (
                  <ShoppingBag className="w-6 h-6 text-secondary-300" />
                ) : (
                  <ShoppingBag className="w-6 h-6 text-secondary-300" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-secondary-800">{order.product_name}</p>
                <div className="flex items-center gap-4 text-sm text-secondary-500 mt-1">
                  <span>Prix: {formatPrice(Number(order.unit_price))}</span>
                  <span>Qté: {order.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-secondary-400">Total</p>
                <p className="text-xl font-bold text-primary-600">{formatPrice(Number(order.total_price))}</p>
              </div>
            </div>
          </div>

          {/* Order info */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary-600" />
              <h2 className="font-display text-lg font-semibold text-secondary-900">Informations commande</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary-400 text-xs mb-0.5">Numéro</p>
                <p className="font-bold text-secondary-800">{order.order_number}</p>
              </div>
              <div>
                <p className="text-secondary-400 text-xs mb-0.5">Date</p>
                <p className="font-medium text-secondary-800">{formatDate(order.created_at)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-secondary-400 text-xs mb-0.5">Statut</p>
                <span className={`badge ${ORDER_STATUS_COLORS[order.status]} !text-sm`}>
                  <span className={`w-2 h-2 rounded-full ${ORDER_STATUS_DOT[order.status]}`} />
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              {order.note && (
                <div className="sm:col-span-2">
                  <p className="text-secondary-400 text-xs mb-0.5 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Remarque
                  </p>
                  <p className="text-secondary-700 bg-secondary-50 rounded-lg p-3 text-sm">{order.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status sidebar */}
        <div className="lg:w-72">
          <div className="card p-5 lg:sticky lg:top-6">
            <h3 className="font-display text-base font-semibold text-secondary-900 mb-4">Modifier le statut</h3>
            <div className="space-y-2">
              {ALL_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || order.status === status}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    order.status === status
                      ? 'bg-primary-50 ring-2 ring-primary-200'
                      : 'hover:bg-secondary-50'
                  } disabled:opacity-50`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${ORDER_STATUS_DOT[status]}`} />
                  <span className={order.status === status ? 'text-primary-700' : 'text-secondary-600'}>
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                </button>
              ))}
            </div>
            <a
              href={`tel:${order.phone}`}
              className="btn-primary w-full mt-5"
            >
              <Phone className="w-4 h-4" />
              Appeler le client
            </a>
            <Link to="/admin/orders" className="btn-secondary w-full mt-2">
              Retour aux commandes
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
