import { authenticateToken } from '$lib/server/credentials.js';
import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';

const studentPhotos: any = import.meta.glob('$lib/server/student-photos/*.png', {
	eager: true,
	import: 'default'
});

export async function GET({ params, cookies }) {
	try {
		authenticateToken(cookies.get('tutorToken'));

		if (!params.auid) throw error(404, 'student AUID not provided');

		try {
			const data = readFileSync(
				`.${studentPhotos[`/src/lib/server/student-photos/${params.auid}.png`]}`
			);
			const contentType = `image/png`;

			return new Response(data, {
				headers: {
					'Content-Type': contentType,
					'Content-Length': data.length.toString(),
					// Add caching headers if desired for performance
					'Cache-Control': 'public, max-age=31536000'
				}
			});
		} catch (e) {
			console.error('Error serving image:', e);
			return error(404, 'Image not found: ' + e);
		}
	} catch (e: any) {
		throw error(500, 'Internal server error: ' + e);
	}
}
