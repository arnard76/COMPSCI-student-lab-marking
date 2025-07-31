<script>
	import { page } from '$app/state';
</script>

<main>
	<h1>ooops, something went wrong!</h1>
	<h2>{page.status}: {page.error?.message}</h2>
	{#if page.status === 401}
		<a href="/logout">Try logging out?</a>
	{:else}
		<a href="/">Back to home page?</a>
	{/if}
</main>
