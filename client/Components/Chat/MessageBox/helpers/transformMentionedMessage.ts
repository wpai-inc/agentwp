/**
 * Transform mentioned message to a format that can be sent to the server.
 *
 * @param {string} text The message to transform.
 * @returns {string} The transformed message.
 */
export default function transformMentionedMessage( text: string ): string {
  let transformedText = text;
  const regex = /\{\{(.*?)\}\}/g;
  const matches = [ ...text.matchAll( regex ) ].map( match => match[ 1 ] );

  matches.forEach( match => {
    const split = match.split( '___' );
    let mention = split[ 2 ].split( ':' );

    /**
     * Remove first item from mention array.
     */
    mention.shift();

    /**
     * Join the mention array to get the title.
     */
    const title = mention.join( ':' );

    /**
     * Replace the mention with a placeholder.
     */
    transformedText = transformedText.replace( match, title );
  } );

  /**
   * Remove double brackets from the transformed text.
   */
  transformedText = transformedText.replace( /\{\{/g, '' ).replace( /\}\}/g, '' );
  return transformedText;
}
