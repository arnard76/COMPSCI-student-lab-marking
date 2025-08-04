import { error } from '@sveltejs/kit';
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

const LAB01_WEEK_START = dayjs('2025-07-27T12:00:00.000Z');
const weekStarts = {
	Lab01: LAB01_WEEK_START,
	Lab02: LAB01_WEEK_START.add(1, 'week'),
	Lab03: LAB01_WEEK_START.add(2, 'weeks'),
	Lab04: LAB01_WEEK_START.add(3, 'weeks'),
	Lab05: LAB01_WEEK_START.add(4, 'weeks'),
	// MIDSEM BREAK
	Lab06: LAB01_WEEK_START.add(7, 'weeks'),
	Lab07: LAB01_WEEK_START.add(8, 'weeks'),
	Lab08: LAB01_WEEK_START.add(9, 'weeks'),
	Lab09: LAB01_WEEK_START.add(11, 'weeks'),
	Lab10: LAB01_WEEK_START.add(12, 'weeks')
};
export function getCurrentLabWeek(): string | 'Midsem' | undefined {
	const now = dayjs();

	const currentLabWeek = Object.entries(weekStarts).find(
		([, labWeekStart]) => labWeekStart.isBefore(now) && labWeekStart.add(1, 'week').isAfter(now)
	)?.[0];

	if (!currentLabWeek || !labWeeks.includes(currentLabWeek)) {
		if (weekStarts.Lab05.add(1, 'week').isBefore(now) && weekStarts.Lab06.isAfter(now)) {
			return 'Midsem';
		}

		return;
	}

	return currentLabWeek;
}

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

export function getCurrentLabSessions(): LabSession[] {
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
