import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import ShortcutGrid from './components/ShortcutGrid';
import AddShortcutModal from './components/AddShortcutModal';
import SettingsModal from './components/SettingsModal';
import { saveCategories, getCategories, getSettings } from './services/storageService';
import { Shortcut, Category, ModalType } from './types';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [settings, setSettings] = useState(getSettings());
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedCategories = getCategories();
    setCategories(loadedCategories);
    if (loadedCategories.length > 0) {
      setActiveCategoryId(loadedCategories[0].id);
    }
    setIsLoaded(true);
  }, []);

  const saveAll = (newCategories: Category[]) => {
    setCategories(newCategories);
    saveCategories(newCategories);
  };

  // --- Category Actions (Managed via Settings now) ---

  const handleAddCategory = (title: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      title,
      shortcuts: []
    };
    const updated = [...categories, newCategory];
    saveAll(updated);
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    saveAll(updated);
  };

  // --- Shortcut Actions ---

  const handleAddShortcut = (title: string, url: string, color: string) => {
    const newShortcut: Shortcut = {
      id: Date.now().toString(),
      title,
      url,
      color
    };

    const updated = categories.map(cat => {
      if (cat.id === activeCategoryId) {
        return { ...cat, shortcuts: [...cat.shortcuts, newShortcut] };
      }
      return cat;
    });

    saveAll(updated);
  };

  const handleDeleteShortcut = (shortcutId: string, categoryId: string) => {
    const updated = categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, shortcuts: cat.shortcuts.filter(s => s.id !== shortcutId) };
      }
      return cat;
    });
    saveAll(updated);
  };

  const handleReorderShortcut = (categoryId: string, fromIndex: number, toIndex: number) => {
    const updated = categories.map(cat => {
      if (cat.id === categoryId) {
        const result = [...cat.shortcuts];
        const [removed] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, removed);
        return { ...cat, shortcuts: result };
      }
      return cat;
    });
    saveAll(updated);
  };

  const handleMoveShortcut = (shortcutId: string, fromCatId: string, toCatId: string) => {
    const sourceCat = categories.find(c => c.id === fromCatId);
    const targetCat = categories.find(c => c.id === toCatId);
    const shortcut = sourceCat?.shortcuts.find(s => s.id === shortcutId);

    if (!sourceCat || !targetCat || !shortcut) return;

    const updated = categories.map(cat => {
      if (cat.id === fromCatId) {
        return { ...cat, shortcuts: cat.shortcuts.filter(s => s.id !== shortcutId) };
      }
      if (cat.id === toCatId) {
        return { ...cat, shortcuts: [...cat.shortcuts, shortcut] };
      }
      return cat;
    });

    saveAll(updated);
  };

  // --- Helpers ---

  // Background Image Style
  const bgStyle = {
    backgroundImage: `url(${settings.backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col text-white transition-opacity duration-700 font-sans"
         style={{ opacity: isLoaded ? 1 : 0 }}>
      
      {/* Background Layer - Clear background without glass effect */}
      <div className="fixed inset-0 z-0" style={bgStyle} />

      {/* Main Container */}
      <div className="relative z-10 flex w-full h-full max-w-[1920px] mx-auto p-2 md:p-4 flex-col">
        
        {/* Header */}
        <div className="flex justify-end mb-2 px-1">
            <button 
               className="p-2 rounded-full bg-glass/20 backdrop-blur-sm hover:bg-glassHover border border-glassBorder text-white/80 hover:text-white transition-all shadow-lg"
               title="Settings"
               onClick={() => setModalType(ModalType.SETTINGS)}
             >
               <Settings size={18} />
             </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-1 pb-20 custom-scrollbar">
          {/* Grid Layout for Categories (2 columns on medium+ screens for the 4-grid look) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
            {categories.map((category) => (
              <div key={category.id} className="animate-fade-in-up flex flex-col h-full">
                <h2 className="text-xs font-semibold text-white/90 mb-1 pl-2 flex items-center gap-2 uppercase tracking-wider">
                  {category.title}
                </h2>
                <div className="relative bg-glass/50 backdrop-blur-2xl rounded-2xl border border-glassBorder shadow-2xl p-2 flex-1 min-h-[140px]">
                  <div className="absolute inset-0 bg-black/20 rounded-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <ShortcutGrid 
                      categoryId={category.id}
                      shortcuts={category.shortcuts} 
                      onAddClick={() => {
                        setActiveCategoryId(category.id);
                        setModalType(ModalType.ADD_SHORTCUT);
                      }}
                      onDeleteClick={(id) => handleDeleteShortcut(id, category.id)}
                      onReorder={(from, to) => handleReorderShortcut(category.id, from, to)}
                      onMoveShortcut={handleMoveShortcut}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center h-64 text-white/50">
                    <p>No categories found.</p>
                    <button onClick={() => setModalType(ModalType.SETTINGS)} className="mt-2 text-blue-400 hover:underline">Open Settings to add one</button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddShortcutModal 
        isOpen={modalType === ModalType.ADD_SHORTCUT}
        onClose={() => setModalType(ModalType.NONE)}
        onAdd={handleAddShortcut}
      />

      <SettingsModal 
        isOpen={modalType === ModalType.SETTINGS}
        onClose={() => setModalType(ModalType.NONE)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

    </div>
  );
}

export default App;