import z from 'zod';
import { error } from '@sveltejs/kit';
import { AUTH_KEY, USERS } from '$env/static/private';

export const CredentialsSchema = z.object({
	name: z.string(),
	password: z.string()
});

export type Credentials = z.infer<typeof CredentialsSchema>;

export type Token = string;

export const tutors = z.parse(z.array(CredentialsSchema), JSON.parse(USERS));

export function authenticateUser(credentials: Credentials): Token {
	const tutor = tutors.find((token) => token.name === credentials.name);
	if (!tutor) throw error(401, "Tutor doesn't exist in system");
	if (tutor.password !== credentials.password) throw error(401, 'Tutor not authenticated');
	return `${AUTH_KEY}${tutor.name}`;
}

export function authenticateToken(token: string | undefined) {
	if (token === undefined) throw error(401, 'No token provided');
	if (!token.includes(AUTH_KEY)) throw error(401, 'Invalid token');
	const tutor = tutors.find((tutor) => tutor.name === token.split(AUTH_KEY).slice(1).join(''));
	if (!tutor) throw error(401, "Tutor doesn't exist in system");
}
