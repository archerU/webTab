import { Shortcut, Category, UserSettings } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_BACKGROUND } from '../constants';

const SHORTCUTS_KEY = 'webtab_shortcuts';
const CATEGORIES_KEY = 'webtab_categories';
const SETTINGS_KEY = 'webtab_settings';

export const getCategories = (): Category[] => {
  try {
    // 1. Try to get categories
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    if (storedCategories) {
      return JSON.parse(storedCategories);
    }

    // 2. Migration: Check for old flat shortcuts
    const oldShortcuts = localStorage.getItem(SHORTCUTS_KEY);
    if (oldShortcuts) {
      const parsedShortcuts: Shortcut[] = JSON.parse(oldShortcuts);
      const migrated: Category[] = [
        {
          id: 'home',
          title: 'Home',
          shortcuts: parsedShortcuts
        },
        ...DEFAULT_CATEGORIES.slice(1) // Add other defaults
      ];
      // Save immediately to complete migration
      saveCategories(migrated);
      localStorage.removeItem(SHORTCUTS_KEY); // Clean up
      return migrated;
    }

    return DEFAULT_CATEGORIES;
  } catch (e) {
    console.error("Failed to load categories", e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {
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

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Export all data for backup
export const exportData = (): string => {
  try {
    const categories = getCategories();
    const settings = getSettings();
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
export const importData = (jsonString: string): { categories: Category[]; settings: UserSettings } => {
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

    // Save imported data
    saveCategories(data.categories);
    saveSettings(data.settings);

    return {
      categories: data.categories,
      settings: data.settings
    };
  } catch (e) {
    console.error('Failed to import data', e);
    throw e;
  }
};