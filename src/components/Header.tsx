import SearchBar from './SearchBar';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0f2042]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-3">
      <div className="max-w-7xl mx-auto">
        <div className="mb-3">
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            Radiadores Centroccidente <span>🔧</span>
          </h1>
          <p className="text-[#93c5fd] text-sm">Sistema de Inventario</p>
        </div>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
    </header>
  );
}
