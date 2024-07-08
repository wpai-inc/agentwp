import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type InputElement = {
  element: Element;
  path: string;
  label: string;
};

type selectedInput = {
  path: string;
  label: string;
  name: string | null;
  id: string | null;
};

type ContextProps = {
  selectedInput: selectedInput | null;
  setSelectedInput: React.Dispatch<React.SetStateAction<selectedInput | null>>;
};
export const InputSelectContext = createContext<ContextProps | undefined>(undefined);

export const useInputSelect = () => {
  const inputSelect = useContext(InputSelectContext);
  if (inputSelect === undefined) {
    throw new Error('useNotifications must be used within a NotificationsContext');
  }
  return inputSelect;
};

export const InputSelectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedInput, setSelectedInput] = useState<selectedInput | null>(null);
  const [allInputElements, setAllInputElements] = useState<InputElement[]>([]);
  const excludeKeywords = ['search'];

  // Function to generate a unique CSS selector for an element
  function generateUniqueSelector(element: Element): string {
    let path = '';
    while (element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.id) {
        selector += '#' + element.id;
        path = selector + (path ? ' > ' + path : '');
        break; // ID is unique, no need to go further
      } else {
        const sibling = element.parentNode.childNodes;
        let nodeIndex = 0;
        let hasSameNodeType = false;
        for (let i = 0; i < sibling.length; i++) {
          if (
            sibling[i].nodeType === Node.ELEMENT_NODE &&
            sibling[i].nodeName === element.nodeName
          ) {
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
  }

  function getAllInputElements() {
    let clickedElement: EventTarget | null = null;

    document.addEventListener('mousedown', event => {
      clickedElement = event.target;
    });

    const inputElements = document.querySelectorAll('input[type="text"], textarea');
    const elements: InputElement[] = [];

    inputElements.forEach(inputElement => {
      // Exclude elements with specific keywords
      if (
        excludeKeywords.some(keyword => {
          return (
            inputElement.getAttribute('name')?.includes(keyword) ||
            inputElement.getAttribute('id')?.includes(keyword) ||
            inputElement.getAttribute('class')?.includes(keyword) ||
            inputElement.getAttribute('placeholder')?.includes(keyword)
          );
        })
      ) {
        return;
      }

      const path = generateUniqueSelector(inputElement);
      const name = inputElement.getAttribute('name');
      const id = inputElement.getAttribute('id');
      let label = '';
      if (id) {
        label = document.querySelector(`label[for="${id}"]`)?.textContent || '';
      } else if (name) {
        label = document.querySelector(`label[for="${name}"]`)?.textContent || '';
      }

      if (
        !elements.some(element => {
          return element.path === path;
        })
      ) {
        if (!inputElement.getAttribute('data-agentwp-element')) {
          inputElement.addEventListener('blur', (event: Event) => {
            const awpChat = document.querySelector('#awp-chat');
            if (awpChat && !awpChat.contains(clickedElement as Node)) {
              setSelectedInput(null);
            }
          });
          inputElement.addEventListener('focus', () => {
            setSelectedInput({
              path,
              label,
              name,
              id,
            });
          });
        }

        elements.push({
          element: inputElement,
          path,
          label,
        });

        inputElement.setAttribute('data-agentwp-element', JSON.stringify({ path, label }));
      }
    });
    console.log('elements', elements);
    // setAllInputElements( elements );
  }

  useEffect(() => {
    getAllInputElements();
  }, []);

  useEffect(() => {
    console.log('selectedInput', selectedInput);
  }, [selectedInput]);

  return (
    <InputSelectContext.Provider
      value={{
        selectedInput,
        setSelectedInput,
      }}>
      {children}
    </InputSelectContext.Provider>
  );
};
