import { pgTable, integer, varchar, check, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { labSessions, labWeeks } from '../labDefinitions';

export const labSession = pgEnum('labSession', labSessions);
export const labWeek = pgEnum('labWeek', labWeeks);

export const marks = pgTable(
	'marks',
	{
		AUID: varchar({ length: 20 }).notNull(),
		marks: integer().notNull(),
		labSession: labSession(),
		labWeek: labWeek()
	},
	(table) => [
		primaryKey({ columns: [table.AUID, table.labWeek, table.labSession] }),
		check('marks_check1', sql`${table.marks} <= 2`),
		check('marks_check2', sql`${table.marks} >= 0`)
	]
);

export const marksSchema = createSelectSchema(marks);

export type Marks = z.infer<typeof marksSchema>;
