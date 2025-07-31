<script lang="ts">
	import { labNumberBeingMarked, labSessionBeingMarked } from '$lib/store';
	import Modal from './Modal.svelte';
	import ShowMarksModal from './ShowMarksModal.svelte';

	let showMarks = $state(false);

	function isDesktopByUserAgent() {
		const userAgent = navigator.userAgent;
		const mobileRegex = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
		return !mobileRegex.test(userAgent);
	}
</script>

{#if $labNumberBeingMarked && $labSessionBeingMarked}
	<div
		class="bg-primary w-full p-2 text-center font-bold text-white"
		ondblclick={() => {
			if (!isDesktopByUserAgent()) return;
			showMarks = true;
		}}
		role="banner"
	>
		Marking {$labNumberBeingMarked}
		{$labSessionBeingMarked}
	</div>

	{#if showMarks}<ShowMarksModal onclose={() => (showMarks = false)} />{/if}
{/if}
