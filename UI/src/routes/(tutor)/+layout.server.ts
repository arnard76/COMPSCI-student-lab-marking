import { authenticateToken } from '$lib/server/credentials';
import students from '$lib/server/students.json';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('tutorToken');
	authenticateToken(token);
	return {
		students
	};
};
