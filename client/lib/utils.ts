import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_CHAT_WINDOW_HEIGHT, DEFAULT_CHAT_WINDOW_WIDTH } from '@/Shared/App';

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

export const nextId = () => Date.now().toString(36) + '-' + Math.random().toString(36).substring(2);

export const isChatWindowMaximized = () => {
  const chatWindow = getChatwindowElement();
  return chatWindow?.classList.contains('maximized');
};

export const resetChatWindowPosition = () => {
  const chatWindow = getChatwindowElement();
  if (chatWindow) {
    chatWindow.style.transform = 'translate(0px, 0px)';
    chatWindow.style.width = DEFAULT_CHAT_WINDOW_WIDTH;
    chatWindow.style.height = DEFAULT_CHAT_WINDOW_HEIGHT;
  }
};

export const getChatwindowElement = () => {
  return document.getElementById('awp-chat');
};

export const getChatWindowTopBarElement = () => {
  return document.getElementById('awp-chat-top-bar');
};

// Function to generate a unique CSS selector for an element
export const generateUniqueSelector = (element: Element): string => {
  let path = '';
  while (element.nodeType === Node.ELEMENT_NODE) {
    let selector = element.nodeName.toLowerCase();
    if (element.id) {
      selector += '#' + element.id;
      path = selector + (path ? ' > ' + path : '');
      break; // ID is unique, no need to go further
    } else {
      const sibling = element?.parentNode?.childNodes;
      let nodeIndex = 0;
      let hasSameNodeType = false;
      for (let i = 0; i < sibling.length; i++) {
        if (sibling[i].nodeType === Node.ELEMENT_NODE && sibling[i].nodeName === element.nodeName) {
          if (sibling[i] === element) {
            nodeIndex = hasSameNodeType ? nodeIndex + 1 : 1;
            break;
          }
          hasSameNodeType = true;
        }
      }
      if (hasSameNodeType) {
        selector += ':nth-of-type(' + nodeIndex + ')';
      }
      path = selector + (path ? ' > ' + path : '');
      element = element.parentNode;
    }
  }
  return path;
};
