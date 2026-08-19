'use client';

import { useUiStore } from '@/store/uiStore';
import { getMessages, t } from './index';

export function useTranslation() {
  const locale = useUiStore((state) => state.locale);
  const messages = getMessages(locale);

  const translate = (path: string, fallback?: string) => {
    return t(locale, path, fallback);
  };

  return { t: translate, locale, messages };
}
