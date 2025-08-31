import { authenticateUser, CredentialsSchema } from '$lib/server/credentials';
import { error, json } from '@sveltejs/kit';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { z } from 'zod';

dayjs.extend(weekday);

export async function POST({ request, cookies }) {
	try {
		const credentials = z.parse(CredentialsSchema, await request.json());

		const token = authenticateUser(credentials);
		cookies.set('tutorToken', token, {
			path: '/',
			expires: new Date(dayjs().weekday(7).toISOString())
		});
		return json({ token });
	} catch (e: any) {
		throw error(400, 'Error: ' + e);
	}
}
