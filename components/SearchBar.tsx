import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl px-4 relative group">
      <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-white/60 group-focus-within:text-white transition-colors duration-300">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="w-full py-4 pl-12 pr-6 bg-glass backdrop-blur-sm rounded-full text-white placeholder-white/60 border border-glassBorder focus:outline-none focus:bg-glassHover focus:border-white/40 shadow-lg transition-all duration-300 text-lg"
        autoFocus
      />
    </form>
  );
};

export default SearchBar;