import { useState, useEffect } from 'react';
import type { Product, ProductFormData } from '../types/database';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onDelete?: (id: string) => void;
  onClose?: () => void;
}

export default function ProductForm({ initialData, onSubmit, onDelete }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    serial: '',
    image_url: '',
    car_model: '',
    year: '',
    stock: 0,
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        serial: initialData.serial,
        image_url: initialData.image_url,
        car_model: initialData.car_model || '',
        year: initialData.year ? String(initialData.year) : '',
        stock: initialData.stock,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        serial: '',
        image_url: '',
        car_model: '',
        year: '',
        stock: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!initialData || !onDelete || deleting) return;
    setDeleting(true);
    onDelete(initialData.id);
  };

  const isValid = formData.name.trim() && formData.serial.trim() && formData.image_url.trim() && formData.price > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#0f2042] mb-1">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Radiador Toyota Corolla"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-[#f8fafc]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#0f2042] mb-1">
            Precio ($) <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-[#f8fafc]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f2042] mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            min="0"
            name="stock"
            value={formData.stock || ''}
            onChange={handleChange}
            placeholder="0"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-[#f8fafc]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0f2042] mb-1">
          Serial <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          name="serial"
          value={formData.serial}
          onChange={handleChange}
          placeholder="Ej: RAD-001"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-[#f8fafc]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#0f2042] mb-1">
            Modelo de Vehículo
          </label>
          <input
            type="text"
            name="car_model"
            value={formData.car_model}
            onChange={handleChange}
            placeholder="Ej: Corolla"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-[#f8fafc]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f2042] mb-1">
            Año
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Ej: 2020"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-[#f8fafc]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0f2042] mb-1">
          URL de Imagen <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all bg-[#f8fafc]"
        />
      </div>

      <div className="pt-4 pb-2">
        <button
          type="submit"
          disabled={submitting || deleting || !isValid}
          className="w-full bg-[#143264] text-white py-3 rounded-xl font-semibold hover:bg-[#1a4580] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {initialData ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>

        {initialData && onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting || deleting}
            className="w-full border-2 border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors mt-3 flex items-center justify-center gap-2"
          >
            {deleting && (
              <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Eliminar Producto
          </button>
        )}
      </div>
    </form>
  );
}
