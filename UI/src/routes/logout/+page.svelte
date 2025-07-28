<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { tutorToken } from '$lib/auth/store';

	tutorToken.set(null);
	if (browser) {
		localStorage.removeItem('tutorToken');
		document.cookie = '';
		goto('/');
	}
</script>
