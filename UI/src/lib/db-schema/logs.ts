import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';
export const logs = pgTable('logs', {
	dateTime: timestamp({ mode: 'string' }).defaultNow().notNull(),
	logMessage: text().notNull()
});

export const logsSchema = createSelectSchema(logs);
export type Logs = z.infer<typeof logsSchema>;
