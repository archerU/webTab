import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Plus, LayoutGrid, Folder, Edit2, Check, X as XIcon, Download, Upload } from 'lucide-react';
import { Category } from '../types';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { exportData, importData } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (title: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCategory: (id: string, title: string) => void;
  onImportData: (categories: Category[], settings?: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  onAddCategory, 
  onDeleteCategory,
  onUpdateCategory,
  onImportData
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage: setLang, t } = useLanguage();
  
  const handleLanguageChange = (lang: Language) => {
    setLang(lang);
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset editing state when modal closes
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setNewCategoryName('');
      setImportError('');
      setImportSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.title);
  };

  const handleSaveEdit = (categoryId: string) => {
    if (editingCategoryName.trim()) {
      onUpdateCategory(categoryId, editingCategoryName.trim());
      setEditingCategoryId(null);
      setEditingCategoryName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webtab-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setImportError(t.exportFailed);
      setTimeout(() => setImportError(''), 3000);
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setImportError(t.invalidFileFormat);
      setTimeout(() => setImportError(''), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const { categories: importedCategories, settings: importedSettings } = importData(jsonString);
        onImportData(importedCategories, importedSettings);
        setImportSuccess(true);
        setTimeout(() => {
          setImportSuccess(false);
          window.location.reload(); // Reload to apply all changes
        }, 1500);
      } catch (error) {
        console.error('Import failed:', error);
        setImportError(error instanceof Error ? error.message : t.importFailed);
        setTimeout(() => setImportError(''), 5000);
      }
    };
    reader.onerror = () => {
      setImportError(t.importFailed);
      setTimeout(() => setImportError(''), 3000);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
                            <div className="flex items-center gap-3 text-white/90 flex-1 min-w-0">
                                {category.id === 'home' ? <LayoutGrid size={18} className="text-blue-400 flex-shrink-0" /> : <Folder size={18} className="text-white/40 flex-shrink-0" />}
                                {editingCategoryId === category.id ? (
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={editingCategoryName}
                                            onChange={(e) => setEditingCategoryName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSaveEdit(category.id);
                                                } else if (e.key === 'Escape') {
                                                    handleCancelEdit();
                                                }
                                            }}
                                            className="flex-1 bg-white/10 border border-blue-500/50 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSaveEdit(category.id)}
                                            className="p-1.5 text-green-400 hover:bg-green-400/10 rounded transition-all"
                                            title={t.save}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-1.5 text-white/50 hover:bg-white/10 rounded transition-all"
                                            title={t.cancel}
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="truncate">{category.title}</span>
                                        <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full flex-shrink-0">{category.shortcuts.length} {t.links}</span>
                                    </>
                                )}
                            </div>
                            
                            {editingCategoryId !== category.id && (
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleStartEdit(category)}
                                        className="p-2 text-white/30 hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-all"
                                        title={t.editCategory}
                                    >
                                        <Edit2 size={16} />
                                    </button>
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

            {/* Import/Export Settings */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">{t.dataManagement}</h3>
                
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleExport}
                        className="w-full px-4 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                    >
                        <Download size={18} />
                        {t.exportConfig}
                    </button>
                    
                    <button
                        onClick={handleImport}
                        className="w-full px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                    >
                        <Upload size={18} />
                        {t.importConfig}
                    </button>
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    
                    {importError && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm">
                            {importError}
                        </div>
                    )}
                    
                    {importSuccess && (
                        <div className="p-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm">
                            {t.importSuccess}
                        </div>
                    )}
                </div>
                
                <p className="mt-3 text-xs text-white/40 text-center">
                    {t.importExportHint}
                </p>
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