<script lang="ts">
	import Icon from '@iconify/svelte';

	let { children } = $props();
</script>

<div class="status-message bg-danger-red">
	<Icon icon="twemoji:grimacing-face" />
	<p>{@render children()}</p>
</div>
