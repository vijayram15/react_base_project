// src/services/i18n/i18nService.ts
import i18next from 'i18next';

export const i18n = {
  // Function to wrap all labels
  translate: (key: string, defaultValue?: string) => {
    // If translation fails, show the key in brackets [MISSING_KEY] 
    // This is the "English Bypass" logic
    return i18next.t(key, { defaultValue: defaultValue || `[${key}]` });
  },
  
  // Initialization logic to be called in main.tsx
  init: async (langData: any) => {
    await i18next.init({
      resources: { en: { translation: langData } },
      lng: 'en',
      fallbackLng: 'en'
    });
  }
};
