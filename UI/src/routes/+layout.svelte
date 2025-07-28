<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { tutorToken } from '$lib/auth/store';
	import '../app.css';

	let { children } = $props();

	$effect(() => {
		const openRoutes = ['/', '/login', '/welcome'];

		let currentPath = page.url.pathname;
		let redirectTo = $tutorToken
			? openRoutes.includes(currentPath)
				? `/pick-lab`
				: null
			: !openRoutes.includes(currentPath)
				? '/login'
				: null;

		if (redirectTo) goto(redirectTo);
	});

	const savedToken = browser && localStorage.getItem('tutorToken');
	if (savedToken && !$tutorToken) {
		tutorToken.set(savedToken);
	}
</script>

{@render children()}
