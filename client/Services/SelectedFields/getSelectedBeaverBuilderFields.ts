declare const FLBuilder: any;

export function getSelectedBeaverBuilderFields( setSelectedInput, selectedInputRef ) {
  if ( typeof FLBuilder !== 'undefined' ) {
    FLBuilder.addHook( 'didCompleteAJAX', function () {
      console.log( 'Layout saved' );
    } );
  }
}
