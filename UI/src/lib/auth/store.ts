import { writable } from 'svelte/store';

export const tutorToken = writable<null | string>(null);
