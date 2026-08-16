import type { Locale } from '@/store/uiStore';
import idMessages from '@/messages/id.json';
import enMessages from '@/messages/en.json';

export type Messages = typeof idMessages;

const allMessages: Record<Locale, Messages> = {
  id: idMessages,
  en: enMessages,
};

export function getMessages(locale: Locale): Messages {
  return allMessages[locale] ?? allMessages.id;
}

export function t(locale: Locale, path: string, fallback?: string): string {
  const messages = allMessages[locale] ?? allMessages.id;
  const keys = path.split('.');
  let value: unknown = messages as Record<string, unknown>;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return fallback ?? path;
    }
  }

  return typeof value === 'string' ? value : fallback ?? path;
}
