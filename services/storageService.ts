import { Shortcut, Category, UserSettings } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_BACKGROUND } from '../constants';

const SHORTCUTS_KEY = 'webtab_shortcuts';
const CATEGORIES_KEY = 'webtab_categories';
const SETTINGS_KEY = 'webtab_settings';
const MIGRATION_KEY = 'webtab_migrated_to_sync';

// Check if chrome.storage is available (Chrome Extension environment)
const isChromeExtension = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync;

// Helper to get storage API
const getStorage = () => {
  if (isChromeExtension) {
    return chrome.storage.sync;
  }
  return null;
};

// Helper to use localStorage as fallback
// Always allow localStorage access, even in Chrome extension
const useLocalStorage = () => {
  return true; // Always use localStorage as primary storage
};

// Async get from chrome.storage.sync
const getFromSync = async (key: string): Promise<string | null> => {
  if (!isChromeExtension) return null;
  try {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.error('Error reading from sync storage:', chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(result[key] || null);
        }
      });
    });
  } catch (e) {
    console.error('Failed to read from sync storage', e);
    return null;
  }
};

// Check data size (chrome.storage.sync has 100KB limit per item, 8KB per value)
const SYNC_STORAGE_LIMIT = 8192; // 8KB per value
const SYNC_STORAGE_TOTAL_LIMIT = 102400; // 100KB total

// Async set to chrome.storage.sync with size check and fallback
const setToSync = async (key: string, value: string): Promise<void> => {
  if (!isChromeExtension) return;
  
  try {
    // Check data size
    const dataSize = new Blob([value]).size;
    
    if (dataSize > SYNC_STORAGE_LIMIT) {
      console.warn(`Data size (${dataSize} bytes) exceeds sync storage limit (${SYNC_STORAGE_LIMIT} bytes). Using local storage instead.`);
      // Data too large for sync, use local storage as fallback
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return;
    }
    
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          const error = chrome.runtime.lastError;
          console.error('Error writing to sync storage:', error.message || error);
          
          // If sync fails, fallback to localStorage
          try {
            localStorage.setItem(key, value);
            console.log('Fallback: Saved to localStorage instead');
          } catch (localError) {
            console.error('Failed to save to localStorage as fallback', localError);
          }
          
          // Don't reject, just log the error and continue
          // This allows the app to work even if sync fails
          resolve();
        } else {
          resolve();
        }
      });
    });
  } catch (e) {
    console.error('Failed to write to sync storage', e);
    // Fallback to localStorage
    try {
      localStorage.setItem(key, value);
      console.log('Fallback: Saved to localStorage instead');
    } catch (localError) {
      console.error('Failed to save to localStorage as fallback', localError);
    }
    // Don't throw, just log and continue
  }
};

// Sync local data to chrome.storage.sync (one-way: local -> sync)
const syncLocalToCloud = async (): Promise<void> => {
  if (!isChromeExtension) return;
  
  try {
    // Sync categories if local exists but sync doesn't
    const localCategories = localStorage.getItem(CATEGORIES_KEY);
    if (localCategories) {
      const syncCategories = await getFromSync(CATEGORIES_KEY);
      if (!syncCategories) {
        // Only sync if sync storage is empty
        await setToSync(CATEGORIES_KEY, localCategories);
      }
    }
    
    // Sync settings if local exists but sync doesn't
    const localSettings = localStorage.getItem(SETTINGS_KEY);
    if (localSettings) {
      const syncSettings = await getFromSync(SETTINGS_KEY);
      if (!syncSettings) {
        // Only sync if sync storage is empty
        await setToSync(SETTINGS_KEY, localSettings);
      }
    }
  } catch (e) {
    console.error('Sync local to cloud failed', e);
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    // Priority 1: Get from localStorage first (fast local access)
    // Always check localStorage first, regardless of Chrome extension environment
    let localData: Category[] | null = null;
    try {
      const storedCategories = localStorage.getItem(CATEGORIES_KEY);
      if (storedCategories) {
        try {
          localData = JSON.parse(storedCategories);
          console.log('Loaded categories from localStorage:', localData?.length || 0, 'categories');
        } catch (e) {
          console.error('Failed to parse local categories', e);
        }
      }
      
      // Migration: Check for old flat shortcuts
      if (!localData) {
        const oldShortcuts = localStorage.getItem(SHORTCUTS_KEY);
        if (oldShortcuts) {
          const parsedShortcuts: Shortcut[] = JSON.parse(oldShortcuts);
          localData = [
            {
              id: 'home',
              title: 'Home',
              shortcuts: parsedShortcuts
            },
            ...DEFAULT_CATEGORIES.slice(1) // Add other defaults
          ];
          // Save immediately to complete migration
          await saveCategories(localData);
          localStorage.removeItem(SHORTCUTS_KEY); // Clean up
        }
      }
    } catch (localError) {
      console.error('Error accessing localStorage:', localError);
    }
    
    // Priority 2: Get from chrome.storage.sync and override local if exists and valid
    if (isChromeExtension) {
      try {
        const syncData = await getFromSync(CATEGORIES_KEY);
        if (syncData) {
          try {
            const syncCategories = JSON.parse(syncData);
            // Validate sync data before using it
            if (syncCategories && Array.isArray(syncCategories) && syncCategories.length > 0) {
              // Validate each category structure
              const isValid = syncCategories.every(cat => 
                cat && 
                typeof cat.id === 'string' && 
                typeof cat.title === 'string' && 
                Array.isArray(cat.shortcuts)
              );
              
              if (isValid) {
                console.log('Loaded categories from sync storage:', syncCategories.length, 'categories');
                // Update localStorage with sync data
                try {
                  localStorage.setItem(CATEGORIES_KEY, syncData);
                } catch (e) {
                  console.error('Failed to update localStorage with sync data', e);
                }
                categoriesCache = syncCategories;
                return syncCategories;
              } else {
                console.warn('Sync categories data is invalid, using local data instead');
              }
            } else {
              console.warn('Sync categories is empty or invalid, using local data instead');
            }
          } catch (parseError) {
            console.error('Failed to parse sync categories', parseError);
          }
        }
      } catch (e) {
        console.error('Failed to get categories from sync', e);
      }
    }
    
    // Return local data if available
    if (localData && Array.isArray(localData) && localData.length > 0) {
      categoriesCache = localData;
      console.log('Using local categories:', localData.length, 'categories');
      return localData;
    }

    console.log('No categories found, using default categories');
    return DEFAULT_CATEGORIES;
  } catch (e) {
    console.error("Failed to load categories", e);
    return DEFAULT_CATEGORIES;
  }
};

// Synchronous version for backward compatibility (uses cached data)
let categoriesCache: Category[] | null = null;
export const getCategoriesSync = (): Category[] => {
  if (categoriesCache) return categoriesCache;
  
  try {
    if (useLocalStorage()) {
      const storedCategories = localStorage.getItem(CATEGORIES_KEY);
      if (storedCategories) {
        categoriesCache = JSON.parse(storedCategories);
        return categoriesCache;
      }
    }
    return DEFAULT_CATEGORIES;
  } catch (e) {
    console.error("Failed to load categories", e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    categoriesCache = categories;
    const data = JSON.stringify(categories);
    
    // Always save to localStorage first (fast local access)
    try {
      localStorage.setItem(CATEGORIES_KEY, data);
    } catch (localError) {
      console.error('Failed to save to localStorage', localError);
    }
    
    // Also save to chrome.storage.sync for synchronization
    if (isChromeExtension) {
      // setToSync now handles errors internally and falls back to localStorage
      await setToSync(CATEGORIES_KEY, data);
    }
  } catch (e) {
    console.error('Failed to save categories', e);
    // Fallback to localStorage
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (localError) {
      console.error('Failed to save to localStorage as fallback', localError);
    }
  }
};

export const getSettings = async (): Promise<UserSettings> => {
  try {
    // Priority 1: Get from localStorage first (fast local access)
    // Always check localStorage first, regardless of Chrome extension environment
    let localData: UserSettings | null = null;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          localData = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse local settings', e);
        }
      }
    } catch (localError) {
      console.error('Error accessing localStorage:', localError);
    }
    
    // Priority 2: Get from chrome.storage.sync and override local if exists
    if (isChromeExtension) {
      try {
        const syncData = await getFromSync(SETTINGS_KEY);
        if (syncData) {
          const syncSettings = JSON.parse(syncData);
          // Sync data overrides local data
              if (syncSettings && typeof syncSettings === 'object') {
                // Update localStorage with sync data
                try {
                  localStorage.setItem(SETTINGS_KEY, syncData);
                } catch (e) {
                  console.error('Failed to update localStorage with sync data', e);
                }
                settingsCache = syncSettings;
                return syncSettings;
              }
        }
      } catch (e) {
        console.error('Failed to get settings from sync', e);
      }
    }
    
    // Return local data if available
    if (localData) {
      settingsCache = localData;
      return localData;
    }
    
    return {
      userName: 'User',
      backgroundImageUrl: DEFAULT_BACKGROUND,
      useAiGreetings: true
    };
  } catch (e) {
    return {
      userName: 'User',
      backgroundImageUrl: DEFAULT_BACKGROUND,
      useAiGreetings: true
    };
  }
};

// Synchronous version for backward compatibility
let settingsCache: UserSettings | null = null;
export const getSettingsSync = (): UserSettings => {
  if (settingsCache) return settingsCache;
  
  try {
    if (useLocalStorage()) {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        settingsCache = JSON.parse(stored);
        return settingsCache;
      }
    }
    return {
      userName: 'User',
      backgroundImageUrl: DEFAULT_BACKGROUND,
      useAiGreetings: true
    };
  } catch (e) {
    return {
      userName: 'User',
      backgroundImageUrl: DEFAULT_BACKGROUND,
      useAiGreetings: true
    };
  }
};

export const saveSettings = async (settings: UserSettings): Promise<void> => {
  try {
    settingsCache = settings;
    const data = JSON.stringify(settings);
    
    // Always save to localStorage first (fast local access)
    try {
      localStorage.setItem(SETTINGS_KEY, data);
    } catch (localError) {
      console.error('Failed to save to localStorage', localError);
    }
    
    // Also save to chrome.storage.sync for synchronization
    if (isChromeExtension) {
      // setToSync now handles errors internally and falls back to localStorage
      await setToSync(SETTINGS_KEY, data);
    }
  } catch (e) {
    console.error('Failed to save settings', e);
    // Fallback to localStorage
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (localError) {
      console.error('Failed to save to localStorage as fallback', localError);
    }
  }
};

// Export all data for backup
export const exportData = async (): Promise<string> => {
  try {
    const categories = await getCategories();
    const settings = await getSettings();
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      categories,
      settings
    };
    return JSON.stringify(data, null, 2);
  } catch (e) {
    console.error('Failed to export data', e);
    throw e;
  }
};

// Import data from backup
export const importData = async (jsonString: string): Promise<{ categories: Category[]; settings: UserSettings }> => {
  try {
    const data = JSON.parse(jsonString);
    
    // Validate data structure
    if (!data.categories || !Array.isArray(data.categories)) {
      throw new Error('Invalid data format: categories missing or invalid');
    }
    
    if (!data.settings || typeof data.settings !== 'object') {
      throw new Error('Invalid data format: settings missing or invalid');
    }

    // Validate categories structure
    for (const category of data.categories) {
      if (!category.id || !category.title || !Array.isArray(category.shortcuts)) {
        throw new Error('Invalid category structure');
      }
    }

    // Save imported data to Google sync storage
    await saveCategories(data.categories);
    await saveSettings(data.settings);

    return {
      categories: data.categories,
      settings: data.settings
    };
  } catch (e) {
    console.error('Failed to import data', e);
    throw e;
  }
};