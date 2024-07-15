import { generateUniqueSelector } from '@/lib/utils';

type InputElementType = {
  element: Element;
  inputPath: string;
  inputLabel: string;
};

export default function getSelectedInputField(
  setSelectedInput: React.Dispatch< React.SetStateAction< any > >,
) {
  const excludeKeywords = [ 'search' ];
  const awpChat = document.querySelector( '#awp-chat' );
  let clickedElement: EventTarget | null = null;

  document.addEventListener( 'mousedown', event => {
    clickedElement = event.target;
  } );

  const inputElements = document.querySelectorAll( 'input[type="text"], textarea' );
  const elements: InputElementType[] = [];

  inputElements.forEach( inputElement => {
    const inputName = inputElement.getAttribute( 'name' );
    const inputId = inputElement.getAttribute( 'id' );

    // Exclude elements with specific keywords
    if (
      excludeKeywords.some( keyword => {
        return (
          inputName?.includes( keyword ) ||
          inputId?.includes( keyword ) ||
          inputElement.getAttribute( 'class' )?.includes( keyword ) ||
          inputElement.getAttribute( 'placeholder' )?.includes( keyword )
        );
      } )
    ) {
      return;
    }

    const inputPath = generateUniqueSelector( inputElement );
    let inputLabel = '';
    if ( inputId ) {
      inputLabel = document.querySelector( `label[for="${ inputId }"]` )?.textContent || '';
    } else if ( inputName ) {
      inputLabel = document.querySelector( `label[for="${ inputName }"]` )?.textContent || '';
    }

    if (
      ! elements.some( element => {
        return element.inputPath === inputPath;
      } )
    ) {
      if ( ! inputElement.getAttribute( 'data-agentwp-element' ) ) {
        inputElement.addEventListener( 'blur', () => {
          if ( awpChat && ! awpChat.contains( clickedElement as Node ) ) {
            console.log( 'nulled setSelectedInput' );
            setSelectedInput( null );
          }
        } );
        inputElement.addEventListener( 'focus', () => {
          setSelectedInput( {
            type: 'input',
            data: {
              inputPath,
              inputLabel,
              inputName,
              inputId,
              inputValue: inputElement.value,
            },
          } );
        } );
      }

      elements.push( {
        element: inputElement,
        inputPath,
        inputLabel,
      } );

      inputElement.setAttribute(
        'data-agentwp-element',
        JSON.stringify( { inputPath, inputLabel } ),
      );
    }
  } );
}
