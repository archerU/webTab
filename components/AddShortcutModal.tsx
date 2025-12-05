import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Palette, Globe } from 'lucide-react';
import { COLORS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface AddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, url: string, color: string, iconUrl?: string) => void;
}

type IconMode = 'auto' | 'upload' | 'color';

const AddShortcutModal: React.FC<AddShortcutModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [iconMode, setIconMode] = useState<IconMode>('auto');
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [customIconUrl, setCustomIconUrl] = useState<string>('');
  const [uploadedIconUrl, setUploadedIconUrl] = useState<string>('');
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) {
      // Reset all fields when modal closes
      setTitle('');
      setUrl('');
      setError('');
      setIconMode('auto');
      setSelectedColor(COLORS[0]);
      setCustomIconUrl('');
      setUploadedIconUrl('');
    } else if (url) {
      // Auto-fetch icon when URL changes
      if (iconMode === 'auto') {
        fetchWebsiteIcon();
      }
    }
  }, [isOpen, url, iconMode]);

  const fetchWebsiteIcon = async () => {
    if (!url.trim()) return;
    
    try {
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      
      const urlObj = new URL(finalUrl);
      const domain = urlObj.hostname;
      
      // Use Google's favicon service
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      setCustomIconUrl(faviconUrl);
    } catch (err) {
      console.error('Failed to fetch website icon', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t.invalidFileType);
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError(t.fileTooLarge);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedIconUrl(result);
      setCustomIconUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !url.trim()) {
      setError(t.fillAllFields);
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    let iconUrl: string | undefined = undefined;
    let color = selectedColor;

    if (iconMode === 'upload' && uploadedIconUrl) {
      iconUrl = uploadedIconUrl;
    } else if (iconMode === 'auto' && customIconUrl) {
      iconUrl = customIconUrl;
    } else if (iconMode === 'color') {
      // Use selected color
      color = selectedColor;
    }

    onAdd(title.trim(), finalUrl, color, iconUrl);
    
    // Reset fields
    setTitle('');
    setUrl('');
    setError('');
    setIconMode('auto');
    setSelectedColor(COLORS[0]);
    setCustomIconUrl('');
    setUploadedIconUrl('');
    onClose();
  };

  const getPreviewIconUrl = () => {
    if (iconMode === 'upload' && uploadedIconUrl) {
      return uploadedIconUrl;
    }
    if (iconMode === 'auto' && customIconUrl) {
      return customIconUrl;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">{t.addShortcut}</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1 uppercase tracking-wider">{t.name}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder-white/20"
                placeholder="e.g. Netflix"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1 uppercase tracking-wider">{t.url}</label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
                onBlur={() => {
                  if (iconMode === 'auto' && url.trim()) {
                    fetchWebsiteIcon();
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder-white/20"
                placeholder="netflix.com"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-wider">{t.customIcon}</label>
              
              {/* Icon Mode Selection */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIconMode('auto');
                    fetchWebsiteIcon();
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    iconMode === 'auto'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Globe size={16} className="inline mr-1" />
                  {t.autoFetchIcon}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIconMode('upload')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    iconMode === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Upload size={16} className="inline mr-1" />
                  {t.uploadIcon}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIconMode('color')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    iconMode === 'color'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Palette size={16} className="inline mr-1" />
                  {t.selectColor}
                </button>
              </div>

              {/* Upload Icon Input */}
              {iconMode === 'upload' && (
                <div className="mb-4">
                  <label className="block w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-full border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition-colors">
                      {uploadedIconUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={uploadedIconUrl} alt="Uploaded icon" className="w-16 h-16 rounded-lg object-cover" />
                          <span className="text-white/60 text-sm">{t.customIcon}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={32} className="text-white/40" />
                          <span className="text-white/60 text-sm">{t.uploadIcon}</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              )}

              {/* Color Selection */}
              {iconMode === 'color' && (
                <div className="mb-4">
                  <div className="grid grid-cols-5 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-full h-12 rounded-lg transition-all ${
                          selectedColor === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Icon Preview */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white/10 border border-white/20">
                  {getPreviewIconUrl() ? (
                    <img 
                      src={getPreviewIconUrl()!} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={() => {
                        // Fallback to color if image fails
                        setCustomIconUrl('');
                      }}
                    />
                  ) : (
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: selectedColor }}
                    >
                      {title.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
              >
                {t.addShortcut}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShortcutModal;
