interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-500/30 hover:bg-[#1d4ed8] hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-200 flex items-center justify-center fab-pulse"
      aria-label="Agregar producto"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
