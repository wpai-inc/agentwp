/**
 * Check if the cursor is in mention mode.
 *
 * @param {string} text The text content of the message.
 * @param {number} cursorPosition The cursor position in the message.
 * @returns {boolean} Whether the cursor is in mention mode.
 */
export default function isMentionMode( text: string, cursorPosition: number ): boolean {
  if ( cursorPosition <= 0 ) {
    return false;
  }

  const beforeCursor = text.substring( 0, cursorPosition );
  const charBeforeCursor = beforeCursor[ cursorPosition - 1 ] || '';

  if ( charBeforeCursor !== '@' ) {
    return false;
  }

  const beforeAt = beforeCursor[ cursorPosition - 2 ] || '';
  console.log( beforeAt );

  if ( ! beforeAt || ! /^[a-zA-Z0-9_]*$/.test( beforeAt ) ) {
    return true;
  }

  return false;
}
