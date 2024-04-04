import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import logo from '@/assets/logo.png';

export default function Counter() {
	const [ count, setCount ] = useState( 0 );
	return (
		<>
			<div>
				<a href="https://codewp.ai" target="_blank">
					<img src={ logo } className="logo" alt="Vite logo" />
				</a>
			</div>
			<h1>Vite + React + WordPress</h1>
			<div className="card">
				<Button onClick={ () => setCount( count => count + 1 ) }>count is { count }</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</>
	);
}
