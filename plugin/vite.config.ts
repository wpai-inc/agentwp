import { v4wp } from '@kucrut/vite-for-wp';
import react from '@vitejs/plugin-react';
import path from 'path';

export default {
	root: 'client',
	plugins: [
		v4wp( {
			input: {
				settings: 'Page/Admin/Settings.tsx',
			},
			outDir: 'build',
		} ),
		react(),
	],
	resolve: {
		alias: {
			'@': path.resolve( __dirname, 'client' ),
		},
	},
};
