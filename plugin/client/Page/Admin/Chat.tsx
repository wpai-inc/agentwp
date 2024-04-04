import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from '@/Components/ui/button';

const rootElement = document.getElementById( 'agent-wp-admin-chat' );
if ( rootElement ) {
	const root = ReactDOM.createRoot( rootElement );
	root.render(
		<React.StrictMode>
			<div className="fixed top-0 right-0 h-screen w-50 z-50 bg-slate-500">
				<Button>Chat Mode</Button>
			</div>
		</React.StrictMode>,
	);
} else {
	// Handle the case where the root element is not found
	console.error( 'Root element not found' );
}
