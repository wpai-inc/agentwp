import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter from '@/Components/Counter';

const rootElement = document.getElementById( 'agent-wp-admin-settings' );
if ( rootElement ) {
	const root = ReactDOM.createRoot( rootElement );
	root.render(
		<React.StrictMode>
			<Counter />
		</React.StrictMode>,
	);
} else {
	// Handle the case where the root element is not found
	console.error( 'Root element not found' );
}
