import { getCurrentLabWeek } from '$lib/labDefinitions';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const currentLabWeek = getCurrentLabWeek();

	if (!currentLabWeek) throw error(404, 'Something went wrong: There is no current lab week');

	if (currentLabWeek === 'Midsem') {
		console.error('current lab week is invalid: ' + currentLabWeek);
		throw error(410, 'It is the midsemester break - get off this app please! 😃😃');
	}

	return { currentLabWeek };
};
