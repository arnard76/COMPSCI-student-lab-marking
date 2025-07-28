import { authenticateUser, CredentialsSchema } from '$lib/server/credentials';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

export async function POST({ request, cookies }) {
	try {
		const credentials = z.parse(CredentialsSchema, await request.json());

		const token = authenticateUser(credentials);
		cookies.set('tutorToken', token, { path: '/' });
		return json({ token });
	} catch (e: any) {
		throw error(400, 'Error: ' + e);
	}
}
