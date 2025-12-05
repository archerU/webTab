import React, { useState } from 'react';
import { X, Trash2, Plus, LayoutGrid, Folder } from 'lucide-react';
import { Category } from '../types';
import { useLanguage, type Language } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (title: string) => void;
  onDeleteCategory: (id: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  onAddCategory, 
  onDeleteCategory 
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const { language, setLanguage: setLang, t } = useLanguage();
  
  const handleLanguageChange = (lang: Language) => {
    setLang(lang);
  };

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">{t.settings}</h2>
            <button 
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            
            {/* Category Management */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">{t.categories}</h3>
                
                <div className="flex flex-col gap-2">
                    {categories.map(category => (
                        <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3 text-white/90">
                                {category.id === 'home' ? <LayoutGrid size={18} className="text-blue-400" /> : <Folder size={18} className="text-white/40" />}
                                <span>{category.title}</span>
                                <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{category.shortcuts.length} {t.links}</span>
                            </div>
                            
                            {category.id !== 'home' && (
                                <button 
                                    onClick={() => {
                                        if (confirm(t.deleteCategoryConfirm.replace('{name}', category.title))) {
                                            onDeleteCategory(category.id);
                                        }
                                    }}
                                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                                    title={t.deleteCategory}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Category Form */}
                <form onSubmit={handleAddSubmit} className="mt-4 flex gap-2">
                    <input 
                        type="text" 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder={t.newCategoryName}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-white/20"
                    />
                    <button 
                        type="submit"
                        disabled={!newCategoryName.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        {t.add}
                    </button>
                </form>
            </div>

            {/* Other Settings Placeholder */}
            <div>
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">{t.appearance}</h3>
                
                {/* Language Selection */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">{t.language}</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                language === 'en'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => handleLanguageChange('zh')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                language === 'zh'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                        >
                            中文
                        </button>
                    </div>
                </div>
                
                <div className="p-4 rounded-lg bg-white/5 text-white/40 text-sm text-center border border-dashed border-white/10">
                    {t.moreSettingsComing}
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-center text-xs text-white/30">
            webTab v1.0.1
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;