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