import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Headphones, ShoppingBag, Sparkles } from 'lucide-react';
import type { Product } from '@/types';
import { fetchProducts } from '@/lib/api';

import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useOrderModal } from '@/hooks/useOrderModal';

const features = [
  { icon: Truck, title: 'Livraison rapide', text: "Nous livrons dans toutes les wilayas d'Algérie." },
  { icon: ShieldCheck, title: 'Qualité garantie', text: 'Des produits sélectionnés avec soin pour vous.' },
  { icon: Headphones, title: 'Accompagnement', text: 'Nous vous contactons pour confirmer chaque commande.' },
  { icon: Sparkles, title: 'Paiement à la livraison', text: 'Payez en toute confiance à la réception.' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleOrder, orderModal } = useOrderModal();

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary-900">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8386651/pexels-photo-8386651.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Boutique"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900 via-secondary-900/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium mb-6 animate-fade-in">
              Nouvelle collection disponible
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up">
              L'élégance à portée de clic
            </h1>
            <p className="text-lg text-secondary-300 mb-8 leading-relaxed max-w-xl">
              Découvrez notre sélection de robes, sacs, chaussures et accessoires.
              Commandez en toute simplicité, nous nous occupons du reste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalogue" className="btn-primary !py-3 !px-8 text-base">
                Voir nos articles
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/catalogue" className="btn-outline !py-3 !px-8 text-base !text-white !border-secondary-500 hover:!bg-white/10">
                Découvrir
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-secondary-900 mb-2">Nos coups de cœur</h2>
            <p className="text-secondary-500">Une sélection de nos plus beaux articles</p>
          </div>
          <Link to="/catalogue" className="hidden sm:flex items-center gap-1 text-primary-600 font-medium hover:gap-2 transition-all">
            Tout voir <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Chargement des produits..." />
        ) : featured.length === 0 ? (
          <p className="text-center text-secondary-500 py-12">Aucun produit disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onOrder={handleOrder} />
            ))}
          </div>
        )}
      </section>

      {/* Why order from us */}
      <section className="bg-secondary-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-secondary-900 mb-2">Pourquoi commander chez nous ?</h2>
            <p className="text-secondary-500">Une expérience d'achat simple et agréable</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <f.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-display text-lg font-semibold text-secondary-900 mb-2">{f.title}</h3>
                <p className="text-sm text-secondary-500 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-primary-600 p-8 lg:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <ShoppingBag className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3">
              Prête à commander ?
            </h2>
            <p className="text-primary-100 mb-6 max-w-lg mx-auto">
              Parcourez notre catalogue et passez votre commande en quelques clics.
              Paiement à la livraison, sans stress.
            </p>
            <Link to="/catalogue" className="inline-flex items-center gap-2 bg-white text-primary-700 font-medium px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
              Découvrir le catalogue
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      {orderModal}
    </div>
  );
}
