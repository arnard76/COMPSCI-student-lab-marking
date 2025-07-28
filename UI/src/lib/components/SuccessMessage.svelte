<script lang="ts">
	import Icon from '@iconify/svelte';

	let { children } = $props();
</script>

<div class="status-message bg-success-green">
	<Icon icon="twemoji:thumbs-up" />
	<p>{@render children()}</p>
</div>
