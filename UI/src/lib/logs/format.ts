import type { Logs } from '$lib/db-schema/logs';
import dayjs from 'dayjs';
import { logInDatabase } from './client';

export type Event =
	| 'marking lab'
	| 'marked student'
	| 'student not shown in list'
	| 'error'
	| 'get current lab marks';

export function formatLog(
	tutorName: string,
	labNumber: string,
	labSession: string,
	event: Event,
	message = ''
) {
	const log = `${tutorName} marking ${labNumber} session ${labSession} ::: ${event}`;

	if (message) return `${log} ::: message ${message}`;
	return log;
}

export function formatErrorLog(attemptedEvent: Event, errorMessage: string) {
	console.log(errorMessage);
	console.log(`${attemptedEvent} failed with error ::: ${errorMessage}`);
	return `${attemptedEvent} failed with error ::: ${errorMessage}`;
}

export async function logError(event: Event, e: string) {
	const log: Logs = {
		dateTime: dayjs().toISOString(),
		logMessage: formatErrorLog(event, e)
	};
	try {
		logInDatabase(log);
	} catch (e1: any) {
		throw Error(formatErrorLog(event, `tried to log ${e} ::: but failed with ${e1}`));
	}
}
