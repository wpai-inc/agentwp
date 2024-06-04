import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_CHAT_WINDOW_HEIGHT, DEFAULT_CHAT_WINDOW_WIDTH } from '@/Shared/App';

export function cn( ...inputs: ClassValue[] ) {
  return twMerge( clsx( inputs ) );
}

export const setStorage = ( key: string, value: any ) => {
  if ( typeof window !== 'undefined' ) {
    window.localStorage.setItem( key, value );
  }
};

export const getStorage = ( key: string, defaultValue?: any ) => {
  if ( typeof window !== 'undefined' ) {
    const value = window.localStorage.getItem( key );
    return !! value ? value : defaultValue;
  }
};

export const removeStorage = ( key: string ) => {
  if ( typeof window !== 'undefined' ) {
    window.localStorage.removeItem( key );
  }
};

export const nextId = () =>
  Date.now().toString( 36 ) + '-' + Math.random().toString( 36 ).substring( 2 );

export const isChatWindowMaximized = () => {
  const chatWindow = getChatwindowElement();
  return chatWindow.classList.contains( 'maximized' );
};

export const resetChatWindowPosition = () => {
  const chatWindow = getChatwindowElement();
  chatWindow.style.transform = 'translate(0px, 0px)';
  chatWindow.style.width = DEFAULT_CHAT_WINDOW_WIDTH;
  chatWindow.style.height = DEFAULT_CHAT_WINDOW_HEIGHT;
};

export const getChatwindowElement = () => {
  return document.getElementById( 'awp-chat' );
};

export const getChatWindowTopBarElement = () => {
  return document.getElementById( 'awp-chat-top-bar' );
};
