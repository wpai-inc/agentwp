document
  .querySelector( '[href="admin.php?page=agentwp-admin-settings&open"]' )
  .addEventListener( 'click', function ( e ) {
    e.preventDefault();
    window.agentwp.dispatchEvent(
      new CustomEvent( 'awp:chat:since', { detail: { since: '2024-01-01' } } ),
    );
  } );
