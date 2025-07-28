import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

let configOptions =
	process.env.NODE_ENV === 'development'
		? {
				server: {
					https: {
						key: fs.readFileSync(`${__dirname}/cert/key.pem`),
						cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
					}
				}
			}
		: {};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	...configOptions
});
