import React, { useState, useEffect, useRef } from 'react';
import { Settings, Globe } from 'lucide-react';
import ShortcutGrid from './components/ShortcutGrid';
import AddShortcutModal from './components/AddShortcutModal';
import SettingsModal from './components/SettingsModal';
import { saveCategories, getCategories, getCategoriesSync, getSettings, getSettingsSync, saveSettings } from './services/storageService';
import { Shortcut, Category, ModalType } from './types';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [settings, setSettings] = useState(() => {
    try {
      return getSettingsSync();
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        userName: 'User',
        backgroundImageUrl: 'https://picsum.photos/1920/1080',
        useAiGreetings: true
      };
    }
  });
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [isLoaded, setIsLoaded] = useState(true); // Start as loaded to avoid black screen
  const categoryDragItem = useRef<number | null>(null);
  const categoryDragOverItem = useRef<number | null>(null);
  const { language, setLanguage: setLang, t } = useLanguage();
  
  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLang(newLang);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading categories...');
        const loadedCategories = await getCategories();
        console.log('Loaded categories:', loadedCategories);
        console.log('Categories count:', loadedCategories.length);
        
        if (loadedCategories && Array.isArray(loadedCategories) && loadedCategories.length > 0) {
          setCategories(loadedCategories);
          if (loadedCategories[0]?.id) {
            setActiveCategoryId(loadedCategories[0].id);
          }
        } else {
          console.warn('No categories loaded, using empty array');
          setCategories([]);
        }
        
        const loadedSettings = await getSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sync version
        try {
          const fallbackCategories = getCategoriesSync();
          console.log('Using fallback categories:', fallbackCategories);
          if (fallbackCategories && Array.isArray(fallbackCategories) && fallbackCategories.length > 0) {
            setCategories(fallbackCategories);
            if (fallbackCategories[0]?.id) {
              setActiveCategoryId(fallbackCategories[0].id);
            }
          }
        } catch (e) {
          console.error('Error loading fallback data:', e);
        }
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadData();
  }, []);

  const saveAll = async (newCategories: Category[]) => {
    setCategories(newCategories);
    try {
      await saveCategories(newCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  // --- Category Actions (Managed via Settings now) ---

  const handleAddCategory = async (title: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      title,
      shortcuts: []
    };
    const updated = [...categories, newCategory];
    await saveAll(updated);
  };

  const handleDeleteCategory = async (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    await saveAll(updated);
  };

  const handleUpdateCategory = async (id: string, title: string) => {
    const updated = categories.map(cat => 
      cat.id === id ? { ...cat, title } : cat
    );
    await saveAll(updated);
  };

  const handleReorderCategory = (fromIndex: number, toIndex: number) => {
    const result = [...categories];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    saveAll(result);
  };

  // Category drag handlers
  const handleCategoryDragStart = (e: React.DragEvent, position: number, categoryId: string) => {
    categoryDragItem.current = position;
    e.dataTransfer.setData('application/webtab-category', categoryId);
    e.dataTransfer.effectAllowed = 'move';
    
    const el = e.currentTarget as HTMLElement;
    setTimeout(() => {
      el.classList.add('opacity-50');
    }, 0);
  };

  const handleCategoryDragEnter = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    categoryDragOverItem.current = position;
  };

  const handleCategoryDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCategoryDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.classList.remove('opacity-50');

    if (categoryDragItem.current !== null && categoryDragOverItem.current !== null && 
        categoryDragItem.current !== categoryDragOverItem.current) {
      handleReorderCategory(categoryDragItem.current, categoryDragOverItem.current);
    }
    
    categoryDragItem.current = null;
    categoryDragOverItem.current = null;
  };

  const handleImportData = async (importedCategories: Category[], importedSettings?: any) => {
    setCategories(importedCategories);
    if (importedCategories.length > 0) {
      setActiveCategoryId(importedCategories[0].id);
    }
    if (importedSettings) {
      setSettings(importedSettings);
      try {
        await saveSettings(importedSettings);
      } catch (error) {
        console.error('Error saving imported settings:', error);
      }
    }
  };

  // --- Shortcut Actions ---

  const handleAddShortcut = (title: string, url: string, color: string, iconUrl?: string) => {
    const newShortcut: Shortcut = {
      id: Date.now().toString(),
      title,
      url,
      color,
      iconUrl
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

  // Show loading state immediately, don't hide the page
  if (!isLoaded) {
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col text-white font-sans">
      
      {/* Background Layer - Clear background without glass effect */}
      <div className="fixed inset-0 z-0" style={bgStyle} />

      {/* Main Container */}
      <div className="relative z-10 flex w-full h-full max-w-[1920px] mx-auto p-2 md:p-4 flex-col">
        
        {/* Header */}
        <div className="flex justify-end gap-2 mb-2 px-1">
            <button 
               className="p-2 rounded-full bg-glass/20 backdrop-blur-sm hover:bg-glassHover border border-glassBorder text-white/80 hover:text-white transition-all shadow-lg flex items-center gap-2 px-3"
               title={language === 'en' ? t.switchLanguage : '切换到英文'}
               onClick={handleLanguageToggle}
             >
               <Globe size={16} />
               <span className="text-xs font-medium">{language === 'en' ? 'EN' : '中文'}</span>
             </button>
            <button 
               className="p-2 rounded-full bg-glass/20 backdrop-blur-sm hover:bg-glassHover border border-glassBorder text-white/80 hover:text-white transition-all shadow-lg"
               title={t.settings}
               onClick={() => setModalType(ModalType.SETTINGS)}
             >
               <Settings size={18} />
             </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-1 pb-20 custom-scrollbar">
          {/* Grid Layout for Categories (2 columns on medium+ screens for the 4-grid look) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <div 
                  key={category.id} 
                  className="animate-fade-in-up flex flex-col h-full cursor-move"
                  draggable
                  onDragStart={(e) => handleCategoryDragStart(e, index, category.id)}
                  onDragEnter={(e) => handleCategoryDragEnter(e, index)}
                  onDragOver={handleCategoryDragOver}
                  onDragEnd={handleCategoryDragEnd}
                >
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
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-white/50">
                <p>{t.noCategories}</p>
                <button onClick={() => setModalType(ModalType.SETTINGS)} className="mt-2 text-blue-400 hover:underline">{t.openSettings}</button>
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
        onUpdateCategory={handleUpdateCategory}
        onImportData={handleImportData}
      />

    </div>
  );
}

export default App;