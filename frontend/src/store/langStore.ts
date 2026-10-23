import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStorage } from '../lib/storage';

export type Lang = 'en' | 'bn';

/** A label in both languages (nav, product details and checkout are bilingual). */
export interface Bi {
  en: string;
  bn: string;
}

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLang = create<LangState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => {
        document.documentElement.lang = lang;
        set({ lang });
      },
    }),
    {
      name: 'sk:lang',
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        if (state) document.documentElement.lang = state.lang;
      },
    },
  ),
);

/** `const t = useT(); t(copy.nav.shop)` picks the current language. */
export function useT() {
  const lang = useLang((s) => s.lang);
  return (label: Bi) => label[lang];
}
