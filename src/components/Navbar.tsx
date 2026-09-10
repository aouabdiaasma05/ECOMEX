import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/catalogue', label: 'Catalogue' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get('q') as string).trim();
    navigate(q ? `/catalogue?q=${encodeURIComponent(q)}` : '/catalogue');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-secondary-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-secondary-900 hidden sm:block">
              Élégance
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                name="q"
                type="text"
                placeholder="Rechercher..."
                className="w-48 pl-9 pr-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100"
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-secondary-100 animate-slide-up">
            <form onSubmit={handleSearch} className="px-2 mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  name="q"
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
            </form>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
