import { writable } from 'svelte/store';
import z from 'zod';
import type { labSessions } from './labDefinitions';

export const StudentSchema = z.object({
	AUID: z.string(),
	email: z.email(),
	UPI: z.string(),
	name: z.string()
});

export type Student = z.infer<typeof StudentSchema>;

export const labSessionBeingMarked = writable<(typeof labSessions)[number] | null>(null);
export const labNumberBeingMarked = writable<string | null>(null);
export const students = writable<Student[]>([]);
