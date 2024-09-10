import { CaretPosition } from './types';

/**
 * Get the caret position and current node
 * in the content editable element
 *
 * @param {React.RefObject<HTMLDivElement>} ref - The content editable element
 * @returns {CaretPosition} The caret position and current node
 */
export default function getCaretPosition( ref: React.RefObject< HTMLDivElement > ): CaretPosition {
  let caretOffset = 0;
  let currentNode = null;
  const selection = window.getSelection();

  if ( selection && selection.rangeCount > 0 && ref.current ) {
    const range = selection.getRangeAt( 0 );
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents( ref.current );
    preCaretRange.setEnd( range.endContainer, range.endOffset );
    caretOffset = preCaretRange.toString().length;

    const node = selection.anchorNode;
    const parent = node?.parentNode;
    if ( parent && ! ( parent as Element ).classList.contains( 'message-box' ) ) {
      currentNode = parent;
    }
  }

  return { caretOffset, currentNode };
}
