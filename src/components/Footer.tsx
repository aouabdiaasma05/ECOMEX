import { ShoppingBag, Phone, Instagram, Facebook, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">Élégance</span>
            </div>
            <p className="text-sm text-secondary-400 leading-relaxed">
              Votre boutique en ligne pour des produits élégants et de qualité. Commandez facilement, nous nous occupons du reste.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary-400 transition-colors">Accueil</a></li>
              <li><a href="/catalogue" className="hover:text-primary-400 transition-colors">Catalogue</a></li>
              <li><a href="/admin" className="hover:text-primary-400 transition-colors">Espace Admin</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="tel:+213555000000" className="hover:text-primary-400 transition-colors">0555 00 00 00</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="mailto:contact@elegance.dz" className="hover:text-primary-400 transition-colors">contact@elegance.dz</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                <span>Alger, Algérie</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Suivez-nous</h3>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-secondary-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-secondary-800 flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-10 pt-6 text-center text-sm text-secondary-500">
          <p>&copy; {new Date().getFullYear()} Boutique Élégance. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
