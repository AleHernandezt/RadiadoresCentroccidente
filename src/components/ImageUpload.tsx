import { useState, useRef, useCallback } from 'react';
import { uploadProductImage } from '../services/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const { url, error: uploadError } = await uploadProductImage(file);
      if (uploadError) {
        setError(uploadError);
        setPreview(null);
        URL.revokeObjectURL(localPreview);
      } else if (url) {
        onChange(url);
        // Keep the local preview until the real URL loads
      }
    } catch {
      setError('Error al subir la imagen');
      setPreview(null);
      URL.revokeObjectURL(localPreview);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }, [processFile]);

  const handleRemove = useCallback(() => {
    onChange('');
    setPreview(null);
    setError(null);
  }, [onChange]);

  const displayImage = value || preview;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#0f2042] mb-1">
        Imagen <span className="text-red-500">*</span>
      </label>

      {displayImage ? (
        /* Image Preview */
        <div className="relative group">
          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border-2 border-[#dbeafe] bg-[#f0f9ff]">
            <img
              src={displayImage}
              alt="Vista previa"
              className="w-full h-full object-cover"
              onLoad={() => {
                // Revoke the local preview blob once the real image loads
                if (preview && value) {
                  URL.revokeObjectURL(preview);
                  setPreview(null);
                }
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-white text-sm font-medium">Subiendo...</span>
                </div>
              </div>
            )}
          </div>

          {/* Remove / Change buttons */}
          {!uploading && (
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white/90 rounded-lg shadow-md hover:bg-white transition-colors"
                title="Cambiar imagen"
              >
                <svg className="w-4 h-4 text-[#0f2042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-white/90 rounded-lg shadow-md hover:bg-red-50 transition-colors"
                title="Eliminar imagen"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative w-full aspect-[16/9] rounded-xl border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-3 transition-all duration-200
            ${isDragging
              ? 'border-[#2563eb] bg-[#2563eb]/10 scale-[1.02]'
              : 'border-gray-300 bg-[#f8fafc] hover:border-[#2563eb]/50 hover:bg-[#eff6ff]'
            }
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin h-8 w-8 text-[#2563eb]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-[#2563eb] text-sm font-medium">Subiendo imagen...</span>
            </div>
          ) : (
            <>
              <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-[#2563eb]/20' : 'bg-[#dbeafe]'}`}>
                <svg className={`w-8 h-8 transition-colors ${isDragging ? 'text-[#2563eb]' : 'text-[#93c5fd]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#0f2042]">
                  {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o'}
                </p>
                {!isDragging && (
                  <p className="text-sm text-[#2563eb] font-semibold mt-0.5">
                    haz clic para seleccionar
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-400">JPG, PNG, WebP • Máx. 5MB</p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
