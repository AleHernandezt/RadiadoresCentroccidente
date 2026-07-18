import { useState, useCallback } from 'react';
import type { Product, ProductFormData } from './types/database';
import { useProducts } from './hooks/useProducts';
import { useSearch } from './hooks/useSearch';
import { useSellProduct } from './hooks/useSellProduct';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Modal from './components/Modal';
import ProductForm from './components/ProductForm';
import FAB from './components/FAB';
import ConfirmDialog from './components/ConfirmDialog';

export default function App() {
  const { products, loading, error, addProduct, editProduct, removeProduct, refreshProducts } = useProducts();
  const { query, setQuery, filteredProducts } = useSearch(products);
  const { sell, sellingId } = useSellProduct(refreshProducts);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Open the add product modal
  const handleOpenAdd = useCallback(() => {
    setEditingProduct(null);
    setIsFormOpen(true);
  }, []);

  // Open the edit product modal
  const handleOpenEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  }, []);

  // Close the form modal
  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingProduct(null);
  }, []);

  // Submit the form (add or edit)
  const handleSubmit = useCallback(async (data: ProductFormData) => {
    if (editingProduct) {
      await editProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    handleCloseForm();
  }, [editingProduct, editProduct, addProduct, handleCloseForm]);

  // Open delete confirmation
  const handleRequestDelete = useCallback((id: string) => {
    setDeletingId(id);
    setIsDeleteConfirmOpen(true);
  }, []);

  // Confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await removeProduct(deletingId);
      setIsDeleteConfirmOpen(false);
      setDeletingId(null);
      handleCloseForm();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [deletingId, removeProduct, handleCloseForm]);

  // Cancel delete
  const handleCancelDelete = useCallback(() => {
    setIsDeleteConfirmOpen(false);
    setDeletingId(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#eff6ff]">
      {/* Sticky Header with Search */}
      <Header searchQuery={query} onSearchChange={setQuery} />

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error al cargar productos: {error}</span>
          <button
            onClick={refreshProducts}
            className="ml-auto text-red-800 font-medium underline underline-offset-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        onSell={sell}
        onEdit={handleOpenEdit}
        sellingId={sellingId}
        loading={loading}
      />

      {/* Floating Action Button */}
      <FAB onClick={handleOpenAdd} />

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <ProductForm
          initialData={editingProduct ?? undefined}
          onSubmit={handleSubmit}
          onDelete={editingProduct ? handleRequestDelete : undefined}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        loading={isDeleting}
      />
    </div>
  );
}
