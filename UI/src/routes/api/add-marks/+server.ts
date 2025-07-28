import { DB_URL } from '$env/static/private';
import { marks, marksSchema } from '$lib/db-schema/marks';
import { authenticateToken } from '$lib/server/credentials';
import { error, json } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(DB_URL);

export const POST = async ({ request, cookies }) => {
	try {
		const token = cookies.get('tutorToken');
		authenticateToken(token);
		const studentMarks = await request.json();
		const parsedMarks = marksSchema.parse(studentMarks);
		await db
			.insert(marks)
			.values(parsedMarks)
			.onConflictDoUpdate({
				target: [marks.AUID, marks.labWeek, marks.labSession],
				set: { marks: parsedMarks.marks }
			});
		return json({ success: true }, { status: 201 });
	} catch (e: any) {
		return error(400, `error with adding marks: ${JSON.stringify(e)}`);
	}
};
