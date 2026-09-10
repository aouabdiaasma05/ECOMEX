import { useEffect, useState, type ReactNode } from 'react';
import type { Order } from '@/types';
import { subscribeToOrders } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { playNotificationSound } from '@/lib/sound';
import NotificationToast from '@/components/NotificationToast';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [newOrder, setNewOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToOrders((order) => {
      setNewOrder(order);
      playNotificationSound();
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <>
      {children}
      {user && <NotificationToast order={newOrder} onDismiss={() => setNewOrder(null)} />}
    </>
  );
}
