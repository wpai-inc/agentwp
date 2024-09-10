/**
 * Get mentions from text.
 *
 * @param {string} text The text to get mentions from.
 * @returns {[]} The mentions in the text.
 */
export default function getMentionsFromText( text: string ) {
  const mentions: any[] = [];
  const regex = /\{\{(.*?)\}\}/g;
  const matches = [ ...text.matchAll( regex ) ].map( match => match[ 1 ] );

  matches.forEach( match => {
    const split = match.split( '___' );
    const id = parseInt( split[ 0 ].split( ':' )[ 1 ] );
    const type = split[ 1 ].split( ':' )[ 1 ];

    mentions.push( { id, type } );
  } );

  return mentions;
}
