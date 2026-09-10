import { Link } from 'react-router-dom';
import { PackageX } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageX,
  title,
  message,
  actionLabel,
  actionTo,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary-400" />
      </div>
      <h3 className="font-display text-lg font-semibold text-secondary-800 mb-1">{title}</h3>
      {message && <p className="text-sm text-secondary-500 mb-4 max-w-sm">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
