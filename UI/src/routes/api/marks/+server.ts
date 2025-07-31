import { DB_URL } from '$env/static/private';
import { labSession, labWeek, marks, marksSchema } from '$lib/db-schema/marks';
import { labSessions, labWeeks } from '$lib/labDefinitions.js';
import { authenticateToken } from '$lib/server/credentials';
import { error, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(DB_URL);

export const GET = async ({ cookies, request, url }) => {
	try {
		const token = cookies.get('tutorToken');
		authenticateToken(token);

		const labNumberQuery = url.searchParams.get('labNumber');
		const labSessionQuery = url.searchParams.get('labSession');
		if (!labNumberQuery || !labSessionQuery) throw Error('specify the lab number & session');
		if (!labSessions.includes(labSessionQuery as any))
			throw Error('this is not a valid lab session: ' + labSessionQuery);
		if (!labWeeks.includes(labNumberQuery as any))
			throw Error('this is not a valid lab number: ' + labNumberQuery);
		const studentMarks = await db
			.select()
			.from(marks)
			.where(
				and(eq(marks.labSession, labSessionQuery as any), eq(marks.labWeek, labNumberQuery as any))
			);

		return json(studentMarks);
	} catch (e: any) {
		return error(400, `error with getting marks: ${JSON.stringify(e)}`);
	}
};

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
