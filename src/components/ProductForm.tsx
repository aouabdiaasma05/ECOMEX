import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Upload, Trash2, ImageIcon } from 'lucide-react';
import type { Product, ProductInput } from '@/types';
import { createProduct, updateProduct } from '@/lib/api';
import { uploadProductImage, deleteProductImage } from '@/lib/storage';
import { formatPrice } from '@/lib/format';

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<ProductInput>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    image_url: product?.image_url ?? null,
    category: product?.category ?? '',
    available: product?.available ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousImageUrl = useRef<string | null>(product?.image_url ?? null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await uploadProductImage(file);
      if (url) {
        setPreview(url);
        setForm((prev) => ({ ...prev, image_url: url }));
      } else {
        setError("Échec de l'envoi de l'image. Veuillez réessayer.");
      }
    } catch {
      setError("Échec de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setForm((prev) => ({ ...prev, image_url: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError('Le nom est requis.');
      return;
    }
    if (form.price <= 0) {
      setError('Le prix doit être supérieur à 0.');
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && product) {
        await updateProduct(product.id, {
          name: form.name.trim(),
          description: form.description?.trim() || null,
          price: form.price,
          image_url: form.image_url,
          category: form.category?.trim() || null,
          available: form.available,
        });
        if (previousImageUrl.current && previousImageUrl.current !== form.image_url) {
          await deleteProductImage(previousImageUrl.current);
        }
      } else {
        await createProduct({
          name: form.name.trim(),
          description: form.description?.trim() || null,
          price: form.price,
          image_url: form.image_url,
          category: form.category?.trim() || null,
          available: form.available,
        });
      }
      onSuccess();
    } catch {
      setError(isEdit ? "Échec de la modification." : "Échec de l'ajout du produit.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-secondary-400 hover:bg-secondary-100 z-10">
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-xl font-bold text-secondary-900 mb-6">
          {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
        </h2>

        {error && (
          <div className="px-4 py-3 mb-4 rounded-lg bg-error-50 border border-error-100 text-error-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="label">Image du produit</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary-100 border border-secondary-200 shrink-0 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-secondary-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn-outline w-full !py-2 text-xs"
                >
                  {uploading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Envoi...</>
                  ) : (
                    <><Upload className="w-3.5 h-3.5" /> Choisir une image</>
                  )}
                </button>
                {preview && (
                  <button type="button" onClick={handleRemoveImage} className="btn-ghost w-full !py-2 text-xs text-error-500 hover:!bg-error-50">
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer l'image
                  </button>
                )}
                <p className="text-xs text-secondary-400">JPG, PNG. 5 Mo max.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Nom <span className="text-error-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="input"
              placeholder="Nom du produit"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="input min-h-[80px] resize-y"
              placeholder="Description du produit"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prix (DA) <span className="text-error-500">*</span></label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="input"
                placeholder="0"
              />
              {form.price > 0 && (
                <p className="text-xs text-primary-600 mt-1 font-medium">{formatPrice(form.price)}</p>
              )}
            </div>
            <div>
              <label className="label">Catégorie</label>
              <input
                type="text"
                value={form.category ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="input"
                placeholder="ex: Robes"
              />
            </div>
          </div>

          <div>
            <label className="label">Disponibilité</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="available"
                  checked={form.available}
                  onChange={() => setForm((prev) => ({ ...prev, available: true }))}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-secondary-700">Disponible</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="available"
                  checked={!form.available}
                  onChange={() => setForm((prev) => ({ ...prev, available: false }))}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-secondary-700">Indisponible</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Annuler</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
