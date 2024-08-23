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

export const nextId = () => Date.now().toString(36) + '-' + Math.random().toString(36).substring(2);

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
      if ( sibling ) {
      for (let i = 0; i < sibling.length; i++) {
        if (sibling[i].nodeType === Node.ELEMENT_NODE && sibling[i].nodeName === element.nodeName) {
          if (sibling[i] === element) {
            nodeIndex = hasSameNodeType ? nodeIndex + 1 : 1;
            break;
          }
          hasSameNodeType = true;
        }
      }
      }
      if (hasSameNodeType) {
        selector += ':nth-of-type(' + nodeIndex + ')';
      }
      path = selector + (path ? ' > ' + path : '');
      element = element.parentNode as Element;
    }
  }
  return path;
};

export type OptimisticFn = (
  fn: () => Promise< any >,
  onSuccess?: () => void,
  onFailure?: ( e: any, msg: string ) => void,
) => Promise< any >;

export const optimistic: OptimisticFn = async ( fn, onSuccess, onFailure ) => {
  onSuccess && onSuccess();

  try {
    return await fn();
  } catch ( e: any ) {
    const msg = e?.msg || 'An error occurred';
    onFailure && onFailure( e, msg );
    throw e;
  }
};

export const getElementByXpath = ( path: string ) => {
  return document.evaluate( path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null )
    .singleNodeValue;
};
