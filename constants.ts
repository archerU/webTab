import { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'home',
    title: 'Home',
    shortcuts: [
      {
        id: '1',
        title: 'Google',
        url: 'https://www.google.com',
        color: '#4285F4'
      },
      {
        id: '2',
        title: 'YouTube',
        url: 'https://www.youtube.com',
        color: '#FF0000'
      },
      {
        id: '3',
        title: 'GitHub',
        url: 'https://github.com',
        color: '#24292e'
      },
      {
        id: '4',
        title: 'ChatGPT',
        url: 'https://chat.openai.com',
        color: '#10A37F'
      }
    ]
  },
  {
    id: 'social',
    title: 'Social',
    shortcuts: [
       {
        id: '5',
        title: 'Twitter',
        url: 'https://twitter.com',
        color: '#1DA1F2'
      },
      {
        id: '6',
        title: 'Reddit',
        url: 'https://reddit.com',
        color: '#FF4500'
      }
    ]
  }
];

export const DEFAULT_BACKGROUND = 'https://picsum.photos/1920/1080';

export const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#f43f5e', // rose
];