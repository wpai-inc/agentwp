/**
 * This function takes an HTML content and transforms it into a plain text format.
 *
 * @param {string} htmlContent The HTML content to transform.
 * @returns {string} The transformed plain text content.
 */
export default function transformContentToText( htmlContent: string ): string {
  const tempDiv = document.createElement( 'div' );
  tempDiv.innerHTML = htmlContent;

  const mentionSpans = tempDiv.querySelectorAll( 'span.mention' );
  mentionSpans.forEach( span => {
    const mentionId = span.getAttribute( 'id' );
    const type = mentionId?.split( '___' )[ 0 ];
    const id = mentionId?.split( '___' )[ 1 ];
    const title = ( span as HTMLElement ).innerText;
    const text = `{{id:${ id }___type:${ type }___title:[${ title }]}}`;

    const textNode = document.createTextNode( text );
    ( span as HTMLElement ).replaceWith( textNode );
  } );

  return tempDiv.textContent || '';
}
