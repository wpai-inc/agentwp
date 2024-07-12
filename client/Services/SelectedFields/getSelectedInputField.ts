import { generateUniqueSelector } from '@/lib/utils';

type InputElementType = {
  element: Element;
  inputPath: string;
  inputLabel: string;
};

export default function getSelectedInputField(
  setSelectedInput: React.Dispatch<React.SetStateAction<any>>,
) {
  const excludeKeywords = ['search'];

  document.body.addEventListener('focusin', function (event) {
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLElement;
    if (
      (inputElement.tagName === 'INPUT' ||
        inputElement.tagName === 'TEXTAREA' ||
        (inputElement.tagName === 'DIV' && inputElement.isContentEditable)) &&
      !inputElement.closest('#awp-chat')
    ) {
      const inputName = inputElement.getAttribute('name');
      const inputId = inputElement.getAttribute('id');
      if (
        excludeKeywords.some(keyword => {
          return (
            inputName?.includes(keyword) ||
            inputId?.includes(keyword) ||
            inputElement.getAttribute('class')?.includes(keyword) ||
            inputElement.getAttribute('placeholder')?.includes(keyword)
          );
        })
      ) {
        return;
      }

      const inputPath = generateUniqueSelector(inputElement);
      let inputLabel = '';
      if (inputId) {
        inputLabel = document.querySelector(`label[for="${inputId}"]`)?.textContent || '';
      } else if (inputName) {
        inputLabel = document.querySelector(`label[for="${inputName}"]`)?.textContent || '';
      }

      setSelectedInput({
        type: 'input',
        data: {
          inputPath,
          inputLabel,
          inputName,
          inputId,
          inputValue: inputElement.value || inputElement.innerText || '',
        },
      });
    }
  });

  document.addEventListener('mousedown', event => {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('#awp-chat')) {
      setSelectedInput(null);
    }
  });
}
