export interface Shortcut {
  id: string;
  title: string;
  url: string;
  iconUrl?: string; // Optional custom icon, otherwise we fetch favicon
  color?: string; // For the fallback initial avatar
}

export interface Category {
  id: string;
  title: string;
  shortcuts: Shortcut[];
}

export interface UserSettings {
  userName: string;
  backgroundImageUrl: string;
  useAiGreetings: boolean;
}

export enum ModalType {
  NONE = 'NONE',
  ADD_SHORTCUT = 'ADD_SHORTCUT',
  ADD_CATEGORY = 'ADD_CATEGORY',
  SETTINGS = 'SETTINGS'
}