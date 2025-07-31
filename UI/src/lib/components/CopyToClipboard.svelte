<script lang="ts">
	import { Clipboard } from 'flowbite-svelte';

	let success = $state(false);
	let { value, children = null } = $props();
</script>

<div class="flex gap-2">
	{#if children}
		{@render children()}
	{:else}<input type="text" {value} disabled />{/if}
	<Clipboard bind:success {value} placeholder="Copy to clipboard">
		{#if success}
			Copied ✅
		{:else}
			Copy
		{/if}
	</Clipboard>
</div>
