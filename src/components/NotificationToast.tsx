import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';
import type { Order } from '@/types';
import { formatPrice, formatTime } from '@/lib/format';

interface NotificationToastProps {
  order: Order | null;
  onDismiss: () => void;
}

export default function NotificationToast({ order, onDismiss }: NotificationToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (order) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [order, onDismiss]);

  if (!order) return null;

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-[200] w-full max-w-sm transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="card border-2 border-primary-200 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 bg-primary-50 px-4 py-3 border-b border-primary-100">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center animate-bounce-once">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-primary-800 text-sm">Nouvelle commande</p>
            <p className="text-xs text-primary-600">{order.order_number}</p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="p-1 rounded-lg text-primary-400 hover:bg-primary-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-3 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-500">Client</span>
            <span className="font-medium text-secondary-800">{order.customer_name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-500">Montant</span>
            <span className="font-bold text-primary-600">{formatPrice(order.total_price)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-500">Heure</span>
            <span className="font-medium text-secondary-800">{formatTime(order.created_at)}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
