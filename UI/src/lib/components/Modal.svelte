<script lang="ts">
	let { onclose = () => null as any, children } = $props();
	let modal = $state<undefined | HTMLDialogElement>();

	$effect(() => modal && modal.showModal());
</script>

<dialog
	bind:this={modal}
	onclickcapture={({ detail, clientX, clientY }) => {
		if (detail === 0) return; // don't close modal for non-mouse click events
		if (!modal) return;
		const { left, right, top, bottom } = modal.getBoundingClientRect();

		if (clientX < left || right < clientX || clientY < top || bottom < clientY) modal?.close();
	}}
	onclose={() => onclose()}
	class="m-auto max-h-[90vh] rounded-xl border-none p-0 drop-shadow-md md:max-w-[75%]"
>
	<div class="p-4">
		{@render children()}
	</div>
</dialog>
