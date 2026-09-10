import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      {message && <p className="mt-3 text-sm text-secondary-500">{message}</p>}
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      <p className="mt-4 text-sm text-secondary-500">Chargement...</p>
    </div>
  );
}
