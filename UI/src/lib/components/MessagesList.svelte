<script lang="ts">
	import ErrorMessage from './ErrorMessage.svelte';
	import SuccessMessage from './SuccessMessage.svelte';

	let { errors = [], success = [] } = $props();
</script>

<div class="mt-4 flex flex-col items-start gap-4">
	{#each errors as error (error)}
		<ErrorMessage>
			{error}
		</ErrorMessage>
	{/each}

	{#each success as successMessage (successMessage)}
		<SuccessMessage>
			{successMessage}
		</SuccessMessage>
	{/each}
</div>
