import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="relative card max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-error-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-secondary-900 mb-1">{title}</h2>
            <p className="text-sm text-secondary-600">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
