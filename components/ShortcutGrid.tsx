import React, { useRef } from 'react';
import { Shortcut } from '../types';
import { Plus, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ShortcutGridProps {
  categoryId: string;
  shortcuts: Shortcut[];
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onMoveShortcut: (shortcutId: string, fromCatId: string, toCatId: string) => void;
}

const ShortcutGrid: React.FC<ShortcutGridProps> = ({ 
  categoryId, 
  shortcuts, 
  onAddClick, 
  onDeleteClick, 
  onReorder,
  onMoveShortcut 
}) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const { t } = useLanguage();

  const getFaviconUrl = (shortcut: Shortcut) => {
    // Priority: custom icon > auto-fetched icon > Google favicon service
    if (shortcut.iconUrl) {
      return shortcut.iconUrl;
    }
    try {
      const domain = new URL(shortcut.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return '';
    }
  };

  // Drag Event Handlers
  const handleDragStart = (e: React.DragEvent, position: number, id: string) => {
    dragItem.current = position;
    const dragData = JSON.stringify({ shortcutId: id, fromCategoryId: categoryId });
    e.dataTransfer.setData('application/webtab-shortcut', dragData); 
    e.dataTransfer.effectAllowed = 'move';
    
    // Slight delay to allow ghost image to form before hiding the original
    const el = e.target as HTMLElement;
    setTimeout(() => {
        el.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    dragOverItem.current = position;
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.target as HTMLElement;
    el.classList.remove('opacity-50');

    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
        onReorder(dragItem.current, dragOverItem.current);
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleContainerDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData('application/webtab-shortcut');
      if (!rawData) return;

      try {
          const { shortcutId, fromCategoryId } = JSON.parse(rawData);
          if (fromCategoryId && fromCategoryId !== categoryId) {
              onMoveShortcut(shortcutId, fromCategoryId, categoryId);
          }
      } catch (err) {
          console.error("Failed to parse drag data", err);
      }
  };

  return (
    <div 
        className="w-full"
        onDragOver={handleDragOver}
        onDrop={handleContainerDrop}
    >
      {/* 
         Grid Layout:
         - minmax(100px, 1fr): Ensures column is wider than the icon to prevent overlap.
         - justify-items-center: Centers the icon in the cell.
      */}
      <div 
        className="grid gap-1 w-full justify-items-center" 
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
      >
        {shortcuts.map((shortcut, index) => (
          <div
            key={shortcut.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index, shortcut.id)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            className="group flex flex-col items-center gap-1 cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 30}ms` }}
            onClick={() => window.open(shortcut.url, '_blank')}
          >
            {/* Icon Container with Delete Button Inside */}
            <div 
              className="relative w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-105 bg-white/20 backdrop-blur-lg group-hover:bg-white/25 ring-1 ring-white/30 group-hover:ring-white/40"
              style={{ backgroundColor: !getFaviconUrl(shortcut) && shortcut.color ? shortcut.color : undefined }}
            >
               {/* Delete Button - Small */}
              <button
                onMouseDown={(e) => e.stopPropagation()} // Critical: Prevents drag start on parent
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if(confirm(t.deleteConfirm)) onDeleteClick(shortcut.id);
                }}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/40 text-white/60 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 backdrop-blur-sm flex items-center justify-center"
                title={translations[getLanguage()].remove}
              >
                <X size={10} strokeWidth={3} />
              </button>

              {getFaviconUrl(shortcut) ? (
                <img 
                  src={getFaviconUrl(shortcut)!} 
                  alt={shortcut.title}
                  className="w-14 h-14 rounded-lg object-cover drop-shadow-sm"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = 'none';
                    // Show fallback with color
                    const fallback = document.createElement('div');
                    fallback.className = 'w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-xl';
                    fallback.style.backgroundColor = shortcut.color || '#6366f1';
                    fallback.textContent = shortcut.title.charAt(0).toUpperCase();
                    img.parentElement?.appendChild(fallback);
                  }}
                />
              ) : (
                <div className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: shortcut.color || '#6366f1' }}>
                  {shortcut.title.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            
            {/* Title */}
            <span className="text-white/60 text-[11px] font-medium truncate w-full max-w-[6rem] text-center px-0.5 group-hover:text-white transition-colors">
              {shortcut.title}
            </span>
          </div>
        ))}

        {/* Add Button */}
        <div
          onClick={onAddClick}
          className="group flex flex-col items-center gap-1 cursor-pointer"
        >
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-300">
            <Plus size={28} className="text-white/30 group-hover:text-white/60" />
          </div>
          <span className="text-white/20 text-[10px] font-medium group-hover:text-white/50">{t.add}</span>
        </div>
      </div>
    </div>
  );
};

export default ShortcutGrid;