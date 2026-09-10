import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    const { error } = mode === 'login'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-secondary-900">Élégance</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold text-secondary-900 text-center mb-1">
            {mode === 'login' ? 'Espace Administrateur' : 'Créer un compte admin'}
          </h1>
          <p className="text-sm text-secondary-500 text-center mb-6">
            {mode === 'login' ? 'Connectez-vous pour accéder au dashboard' : 'Créez votre compte administrateur'}
          </p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-error-50 border border-error-100 text-error-700 text-sm animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elegance.dz"
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                'Se connecter'
              ) : (
                'Créer le compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-secondary-500">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-primary-600 font-medium hover:underline"
                >
                  Créer un compte
                </button>
              </p>
            ) : (
              <p className="text-secondary-500">
                Déjà un compte ?{' '}
                <button
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-primary-600 font-medium hover:underline"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>

        <Link to="/" className="block mt-6 text-center text-sm text-secondary-500 hover:text-secondary-700">
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
