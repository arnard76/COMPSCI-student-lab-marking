<script>
	import { labNumberBeingMarked, labSessionBeingMarked } from '$lib/store';
</script>

{#if $labNumberBeingMarked && $labSessionBeingMarked}
	<div class="bg-primary w-full p-2 text-center font-bold text-white">
		Marking {$labNumberBeingMarked}
		{$labSessionBeingMarked}
	</div>
{/if}
