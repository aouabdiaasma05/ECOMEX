import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2 } from 'lucide-react';

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  orderNumber: string;
}

export default function OrderSuccessModal({ open, onClose, orderNumber }: OrderModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative card max-w-md w-full p-8 text-center animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-secondary-400 hover:bg-secondary-100"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-success-100 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-success-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-secondary-900 mb-2">
          Commande enregistrée !
        </h2>
        <p className="text-secondary-600 mb-1">
          Votre commande a été enregistrée avec succès.
        </p>
        <p className="text-secondary-600 mb-4">
          Nous vous contacterons prochainement pour confirmer votre commande.
        </p>
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-secondary-500 mb-1">Numéro de commande</p>
          <p className="font-display text-xl font-bold text-primary-700">{orderNumber}</p>
        </div>
        <button onClick={onClose} className="btn-primary w-full">
          Fermer
        </button>
      </div>
    </div>,
    document.body
  );
}
