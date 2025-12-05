import React from 'react';
import { Category } from '../types';
import { Folder, Plus, Trash2, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onMoveShortcutToCategory: (shortcutId: string, targetCategoryId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  onMoveShortcutToCategory
}) => {

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault(); // Necessary to allow dropping
    if (categoryId !== activeCategoryId) {
      e.currentTarget.classList.add('bg-white/20');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-white/20');
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-white/20');
    
    // Retrieve the data sent from ShortcutGrid
    const shortcutId = e.dataTransfer.getData('text/plain');
    if (shortcutId && targetCategoryId !== activeCategoryId) {
      onMoveShortcutToCategory(shortcutId, targetCategoryId);
    }
  };

  return (
    <div className="w-20 md:w-64 flex-shrink-0 flex flex-col gap-4 h-full py-4 pl-4">
      <div className="flex-1 bg-glass/20 backdrop-blur-md rounded-2xl border border-glassBorder p-3 flex flex-col gap-2 overflow-y-auto">
        <h2 className="hidden md:block text-xs font-bold text-white/50 uppercase tracking-wider mb-2 px-3">
          Categories
        </h2>
        
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            onDragOver={(e) => handleDragOver(e, category.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, category.id)}
            className={`
              group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200
              ${activeCategoryId === category.id 
                ? 'bg-white/20 text-white shadow-lg border border-white/10' 
                : 'text-white/70 hover:bg-white/10 hover:text-white border border-transparent'}
            `}
          >
            {category.id === 'home' ? <LayoutGrid size={18} /> : <Folder size={18} />}
            <span className="hidden md:block text-sm font-medium truncate flex-1">
              {category.title}
            </span>
            <span className="hidden md:flex text-[10px] bg-black/20 px-2 py-0.5 rounded-full text-white/50">
              {category.shortcuts.length}
            </span>

            {/* Delete Button (don't delete home) */}
            {category.id !== 'home' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm(`Delete category "${category.title}" and all its shortcuts?`)) {
                    onDeleteCategory(category.id);
                  }
                }}
                className="md:hidden group-hover:block absolute right-2 p-1.5 rounded-md hover:bg-red-500/80 text-white/40 hover:text-white transition-all"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={onAddCategory}
          className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-white/50 hover:bg-white/5 hover:text-white transition-all mt-2 border border-dashed border-white/10 hover:border-white/30"
        >
          <Plus size={18} />
          <span className="hidden md:block text-sm font-medium">New Category</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;