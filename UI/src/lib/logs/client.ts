import { logsSchema, type Logs } from '$lib/db-schema/logs';

export async function logInDatabase(log: Logs) {
	logsSchema.parse(log);
	const res = await fetch('/api/log-info', {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(log)
	});

	if (res.status !== 201)
		throw Error(`Didnt: fetch request failed with code: ${res.status} ::: ${await res.json()}`);
}
