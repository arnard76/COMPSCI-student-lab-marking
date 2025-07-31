<script>
	import { page } from '$app/state';
</script>

<h1>ooops, something went wrong!</h1>
<h2>{page.status}: {page.error?.message}</h2>
{#if page.error?.message.toLowerCase().includes('invalid token')}
	<a href="/logout">Try logging out?</a>
{:else}
	<a href="/">Back to home page?</a>
{/if}
