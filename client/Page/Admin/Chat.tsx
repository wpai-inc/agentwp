import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from '@/Components/ui/button';
import App from '@/Shared/App';
import Counter from '@/Components/Counter';

const rootElement = document.getElementById( 'agent-wp-admin-chat' );
if ( rootElement ) {
	const root = ReactDOM.createRoot( rootElement );
	root.render(
		<React.StrictMode>
			<App>
				<div className="fixed top-[32px] right-0 h-screen w-[500px] z-50 bg-slate-500">
					<Button>Chat Mode</Button>
					<Counter />
				</div>
			</App>
		</React.StrictMode>,
	);
} else {
	// Handle the case where the root element is not found
	console.error( 'Root element not found' );
}
