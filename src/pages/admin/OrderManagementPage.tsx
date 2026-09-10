import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { fetchOrders } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_DOT } from '@/types';
import AdminLayout from '@/components/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

const STATUS_FILTERS: (OrderStatus | 'all')[] = [
  'all', 'new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled',
];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...orders];
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.product_name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, search, statusFilter]);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Chargement des commandes..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-secondary-900">Gestion des commandes</h1>
        <p className="text-sm text-secondary-500 mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''} au total</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par numéro, client, téléphone..."
          className="input pl-10 max-w-md"
        />
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            {s === 'all' ? 'Toutes' : ORDER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Aucune commande"
          message={search || statusFilter !== 'all' ? "Aucune commande ne correspond à vos critères." : "Les commandes apparaîtront ici."}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 text-secondary-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">N°</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Téléphone</th>
                  <th className="text-left px-5 py-3 font-medium">Produit</th>
                  <th className="text-center px-5 py-3 font-medium">Qté</th>
                  <th className="text-center px-5 py-3 font-medium">Total</th>
                  <th className="text-center px-5 py-3 font-medium">Statut</th>
                  <th className="text-center px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filtered.map((order) => (
                  <tr key={order.id} className={`hover:bg-secondary-50 transition-colors ${!order.seen && order.status === 'new' ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-5 py-3 font-medium text-secondary-800 whitespace-nowrap">{order.order_number}</td>
                    <td className="px-5 py-3 text-secondary-500 whitespace-nowrap">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-3 text-secondary-700">{order.customer_name}</td>
                    <td className="px-5 py-3 text-secondary-600 hidden lg:table-cell whitespace-nowrap">{order.phone}</td>
                    <td className="px-5 py-3 text-secondary-600 max-w-[140px] truncate">{order.product_name}</td>
                    <td className="px-5 py-3 text-center text-secondary-700">{order.quantity}</td>
                    <td className="px-5 py-3 font-semibold text-secondary-800 text-center whitespace-nowrap">{formatPrice(Number(order.total_price))}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ORDER_STATUS_DOT[order.status]}`} />
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className={`card p-4 block ${!order.seen && order.status === 'new' ? 'ring-2 ring-amber-200' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-secondary-800 text-sm">{order.order_number}</p>
                    <p className="text-xs text-secondary-400">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ORDER_STATUS_DOT[order.status]}`} />
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-700">{order.customer_name}</p>
                    <p className="text-xs text-secondary-500 truncate max-w-[150px]">{order.product_name} × {order.quantity}</p>
                  </div>
                  <span className="font-bold text-primary-600">{formatPrice(Number(order.total_price))}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
