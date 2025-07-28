import dayjs from 'dayjs';

export const labWeeks = Array.from(
	{ length: 10 },
	(_, i) => `Lab${(i + 1).toString().padStart(2, '0')}`
) as [string, ...string[]] satisfies string[];

export const labSessions = [
	'Monday 10am-12pm',
	'Tuesday 10am-12pm',
	'Tuesday 1-3pm',
	'Wednesday 12-2pm',
	'Wednesday 2-4pm',
	'Friday 12-2pm'
] as const satisfies string[];

export type LabSession = (typeof labSessions)[number];

export function getCurrentLabWeek() {
	// const startReference = ;
	dayjs();
}

export function getCurrentLabSessions(): LabSession[] {
	function createRangeArrayFrom(x: number, y: number) {
		const length = y - x;
		return Array.from({ length }, (_, index) => x + index);
	}

	const sessionOnDays = {
		// SUNDAY TO SATURDAY
		0: [],
		1: createRangeArrayFrom(0, 1),
		2: createRangeArrayFrom(1, 3),
		3: createRangeArrayFrom(3, 5),
		4: [],
		5: createRangeArrayFrom(5, 6),
		6: []
	};

	const sessionsToday = sessionOnDays[dayjs().day()];
	return sessionsToday.map((index) => labSessions[index]);

	// ONLY ALLOW MARKING OF CURRENT SESSIONS 👇
	// const hoursEnd = [12, 12, 15, 14, 16, 14];
	// return sessionsToday
	// 	.filter((sessionIndex) => {
	// 		const TIME_AFTER_SESSION_FOR_MARKING = 5; // hours
	// 		return hoursEnd[sessionIndex] + TIME_AFTER_SESSION_FOR_MARKING >= dayjs().hour();
	// 	})
	// 	.map((index) => labSessions[index]);
}
