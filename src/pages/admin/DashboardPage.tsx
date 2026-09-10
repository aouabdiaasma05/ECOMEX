import { useEffect, useMemo, useState } from 'react';
import { Package, ShoppingCart, Clock, Eye, TrendingUp } from 'lucide-react';
import type { Order, Product } from '@/types';
import { fetchOrders, fetchProducts, markOrderSeen } from '@/lib/api';
import { formatPrice, formatDate, formatTime } from '@/lib/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_DOT } from '@/types';
import AdminLayout from '@/components/AdminLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts()])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => new Date(o.created_at) >= today);
    const newOrders = orders.filter((o) => o.status === 'new');
    const availableProducts = products.filter((p) => p.available);
    return {
      totalProducts: products.length,
      availableProducts: availableProducts.length,
      totalOrders: orders.length,
      newOrders: newOrders.length,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total_price), 0),
    };
  }, [orders, products]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const handleMarkSeen = async (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, seen: true } : o)));
    try {
      await markOrderSeen(id);
    } catch {
      // revert on failure
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, seen: false } : o)));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Chargement du dashboard..." />
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total produits', value: stats.totalProducts, sub: `${stats.availableProducts} disponibles`, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total commandes', value: stats.totalOrders, sub: `${stats.newOrders} nouvelles`, icon: ShoppingCart, color: 'text-primary-600 bg-primary-50' },
    { label: 'Commandes du jour', value: stats.todayOrders, sub: formatPrice(stats.todayRevenue), icon: Clock, color: 'text-accent-600 bg-accent-50' },
    { label: 'Nouvelles commandes', value: stats.newOrders, sub: 'À traiter', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-secondary-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">{s.value}</p>
            <p className="text-sm text-secondary-500">{s.label}</p>
            <p className="text-xs text-secondary-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
          <h2 className="font-display text-lg font-semibold text-secondary-900">Commandes récentes</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 font-medium hover:underline">
            Tout voir
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-center text-secondary-500 py-12">Aucune commande pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary-50 text-secondary-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">N° Commande</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Client</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Produit</th>
                  <th className="text-center px-5 py-3 font-medium">Total</th>
                  <th className="text-center px-5 py-3 font-medium">Statut</th>
                  <th className="text-center px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className={`hover:bg-secondary-50 transition-colors ${!order.seen && order.status === 'new' ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-5 py-3 font-medium text-secondary-800 whitespace-nowrap">
                      {order.order_number}
                    </td>
                    <td className="px-5 py-3 text-secondary-500 hidden sm:table-cell whitespace-nowrap">
                      <div>{formatDate(order.created_at)}</div>
                      <div className="text-xs text-secondary-400">{formatTime(order.created_at)}</div>
                    </td>
                    <td className="px-5 py-3 text-secondary-700">{order.customer_name}</td>
                    <td className="px-5 py-3 text-secondary-600 hidden md:table-cell max-w-[160px] truncate">
                      {order.product_name}
                    </td>
                    <td className="px-5 py-3 font-semibold text-secondary-800 text-center whitespace-nowrap">
                      {formatPrice(Number(order.total_price))}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ORDER_STATUS_DOT[order.status]}`} />
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {!order.seen && order.status === 'new' && (
                        <button
                          onClick={() => handleMarkSeen(order.id)}
                          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Vue
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
