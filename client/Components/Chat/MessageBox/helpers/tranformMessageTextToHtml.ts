/**
 * Transform message text to html with mentions.
 *
 * @param {string} text The message to transform.
 * @return {string} The transformed message.
 */
export default function transformMessageTextToHtml( text: string ): string {
  const regex = /\[@(.*?)\]/g;
  const matches = [ ...text.matchAll( regex ) ].map( match => match[ 1 ] );
  matches.forEach( match => {
    const span = document.createElement( 'span' );
    span.innerHTML = '@' + match;
    span.className =
      'bg-brand-gray-50/50 text-brand-gray-70 rounded-full mention inline-block px-2 py-0.5';
    text = text.replace( `[@${ match }]`, span.outerHTML );
  } );

  return text;
}
