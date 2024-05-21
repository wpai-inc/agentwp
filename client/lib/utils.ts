import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
};

export const getStorage = (key: string, defaultValue?: any) => {
  if (typeof window !== 'undefined') {
    const value = window.localStorage.getItem(key);
    return !!value ? value : defaultValue;
  }
};

export const removeStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
};

export const resetChatWindowPosition = (chatWindowElement) => {
  if (chatWindowElement) {
    chatWindowElement.style.transform = 'translate(0px, 0px)'
  }
}
