import { writable } from 'svelte/store';

export const globalSuccesses = writable<string[]>([]);
// export const globalErrors = writable<string[]>([]);

export function addMessage(type: 'success', message: string, duration = 5_000) {
	if (type === 'success') {
		globalSuccesses.update((messages) => {
			messages.push(message);
			return messages;
		});
		setTimeout(
			() =>
				globalSuccesses.update((messages) => {
					messages.splice(messages.findIndex((m) => m === message));
					return messages;
				}),
			duration
		);
	}
}
