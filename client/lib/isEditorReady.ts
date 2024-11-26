declare const wp: any;
export default function isEditorReady( callback: () => void ) {
  if ( typeof wp === 'undefined' ) {
    return;
  }
  const closeListener = wp?.data?.subscribe( () => {
    const isReady = wp?.data?.select( 'core/editor' )?.__unstableIsEditorReady();
    if ( ! isReady ) {
      return;
    }
    closeListener();
    setTimeout( () => callback(), 200 );
  } );
}
