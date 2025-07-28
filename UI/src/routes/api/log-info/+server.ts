import { DB_URL } from '$env/static/private';
import { logs, logsSchema } from '$lib/db-schema/logs';
import { authenticateToken } from '$lib/server/credentials';
import { error, json } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(DB_URL);

export const POST = async ({ request, cookies }) => {
	try {
		const token = cookies.get('tutorToken');
		authenticateToken(token);
		const log = await request.json();
		const parsedLog = logsSchema.parse(log);
		await db.insert(logs).values(parsedLog);
		return json({ success: true }, { status: 201 });
	} catch (e: any) {
		return error(400, `error with adding log: ${JSON.stringify(e)}`);
	}
};
