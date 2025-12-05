export type Language = 'en' | 'zh';

export interface Translations {
  addShortcut: string;
  addCategory: string;
  settings: string;
  cancel: string;
  save: string;
  delete: string;
  name: string;
  url: string;
  uploadIcon: string;
  selectColor: string;
  autoFetchIcon: string;
  customIcon: string;
  useWebsiteIcon: string;
  noIconSelected: string;
  fillAllFields: string;
  deleteShortcut: string;
  deleteCategory: string;
  deleteConfirm: string;
  openSettings: string;
  noCategories: string;
  categories: string;
  appearance: string;
  moreSettingsComing: string;
  openNewTab: string;
  remove: string;
  add: string;
  fileTooLarge: string;
  invalidFileType: string;
  links: string;
  newCategoryName: string;
  deleteCategoryConfirm: string;
  language: string;
  switchLanguage: string;
  newCategory: string;
  create: string;
  enterCategoryName: string;
  categoryPlaceholder: string;
  searchPlaceholder: string;
  consultingStars: string;
  goodDay: string;
  editCategory: string;
  dataManagement: string;
  exportConfig: string;
  importConfig: string;
  exportFailed: string;
  exportSuccess: string;
  importFailed: string;
  importSuccess: string;
  invalidFileFormat: string;
  importExportHint: string;
  syncEnabled: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    addShortcut: 'Add Shortcut',
    addCategory: 'Add Category',
    settings: 'Settings',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    name: 'Name',
    url: 'URL',
    uploadIcon: 'Upload Icon',
    selectColor: 'Select Color',
    autoFetchIcon: 'Auto Fetch Icon',
    customIcon: 'Custom Icon',
    useWebsiteIcon: 'Use Website Icon',
    noIconSelected: 'No Icon Selected',
    fillAllFields: 'Please fill in all fields',
    deleteShortcut: 'Delete Shortcut',
    deleteCategory: 'Delete Category',
    deleteConfirm: 'Are you sure you want to delete?',
    openSettings: 'Open Settings to add one',
    noCategories: 'No categories found.',
    categories: 'Categories',
    appearance: 'Appearance',
    moreSettingsComing: 'More settings coming soon...',
    openNewTab: 'Open New Tab',
    remove: 'Remove',
    add: 'Add',
    fileTooLarge: 'File size must be less than 2MB',
    invalidFileType: 'Please select an image file',
    links: 'links',
    newCategoryName: 'New category name...',
    deleteCategoryConfirm: 'Delete "{name}" and all its shortcuts?',
    language: 'Language',
    switchLanguage: 'Switch to 中文',
    newCategory: 'New Category',
    create: 'Create',
    enterCategoryName: 'Please enter a category name',
    categoryPlaceholder: 'e.g. Work',
    searchPlaceholder: 'Search the web...',
    consultingStars: 'Consulting the stars...',
    goodDay: 'Good day, {name}.',
    editCategory: 'Edit Category',
    dataManagement: 'Data Management',
    exportConfig: 'Export Configuration',
    importConfig: 'Import Configuration',
    exportFailed: 'Failed to export configuration',
    exportSuccess: 'Configuration exported successfully!',
    importFailed: 'Failed to import configuration. Please check the file format.',
    importSuccess: 'Configuration imported successfully!',
    invalidFileFormat: 'Invalid file format. Please select a JSON file.',
    importExportHint: 'Export your configuration to backup, or import a previous backup to restore.',
    syncEnabled: '✓ Your data is synced to your Google account',
  },
  zh: {
    addShortcut: '添加快捷方式',
    addCategory: '添加分类',
    settings: '设置',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    name: '名称',
    url: '网址',
    uploadIcon: '上传图标',
    selectColor: '选择颜色',
    autoFetchIcon: '自动获取图标',
    customIcon: '自定义图标',
    useWebsiteIcon: '使用网站图标',
    noIconSelected: '未选择图标',
    fillAllFields: '请填写所有字段',
    deleteShortcut: '删除快捷方式',
    deleteCategory: '删除分类',
    deleteConfirm: '确定要删除吗？',
    openSettings: '打开设置添加',
    noCategories: '未找到分类。',
    categories: '分类',
    appearance: '外观',
    moreSettingsComing: '更多设置即将推出...',
    openNewTab: '打开新标签页',
    remove: '移除',
    add: '添加',
    fileTooLarge: '文件大小必须小于 2MB',
    invalidFileType: '请选择图片文件',
    links: '个链接',
    newCategoryName: '新分类名称...',
    deleteCategoryConfirm: '删除 "{name}" 及其所有快捷方式？',
    language: '语言',
    switchLanguage: 'Switch to English',
    newCategory: '新分类',
    create: '创建',
    enterCategoryName: '请输入分类名称',
    categoryPlaceholder: '例如：工作',
    searchPlaceholder: '搜索网页...',
    consultingStars: '正在咨询星辰...',
    goodDay: '你好，{name}。',
    editCategory: '编辑分类',
    dataManagement: '数据管理',
    exportConfig: '导出配置',
    importConfig: '导入配置',
    exportFailed: '导出配置失败',
    exportSuccess: '配置导出成功！',
    importFailed: '导入配置失败，请检查文件格式。',
    importSuccess: '配置导入成功！',
    invalidFileFormat: '无效的文件格式，请选择 JSON 文件。',
    importExportHint: '导出配置以备份，或导入之前的备份以恢复。',
    syncEnabled: '✓ 您的数据已同步到 Google 账号',
  },
};

export const getLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('webtab_language');
    if (saved === 'en' || saved === 'zh') {
      return saved;
    }
    // Auto-detect from browser
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'en'; // Fallback to English
  }
};

export const setLanguage = (lang: Language) => {
  try {
    localStorage.setItem('webtab_language', lang);
  } catch (error) {
    console.error('Error setting language to localStorage:', error);
  }
};

