<script lang="ts">
	import { goto } from '$app/navigation';
	import MessagesList from '$lib/components/MessagesList.svelte';
	import { getCurrentLabSessions, labSessions, type LabSession } from '$lib/labDefinitions';
	import { labNumberBeingMarked, labSessionBeingMarked } from '$lib/store';

	let { data } = $props();

	labNumberBeingMarked.set(data.currentLabWeek);
	const currentSessions = getCurrentLabSessions();
	let labSessionInput = $state<LabSession | null>(
		// TODO: pick a default lab session on the day based on the time
		// Right now it just chooses the first one `currentSessions[0]` of the day (not ideal for my wednesday session because it is the second one)

		$labSessionBeingMarked || (currentSessions.length ? currentSessions[0] : null)
	);

	let errors = $state<string[]>([]);

	$effect(() => {
		errors = [];
		if (labSessionInput === null) return;
		if (currentSessions.includes(labSessionInput)) return;
		errors = [`This session doesn't happen today`];
	});

	function startMarking(e: MouseEvent) {
		e.preventDefault();

		if (!labSessionInput) return;
		goto('/find-student');
		labSessionBeingMarked.set(labSessionInput);
	}
</script>

<main>
	<h1>Pick {$labNumberBeingMarked} Session</h1>
	<form class="mt-8 flex flex-col items-start gap-10">
		<div class="input-group">
			<label for="lab-session-input">Select a lab session (time)</label>
			<select id="lab-session-input" bind:value={labSessionInput}>
				{#each labSessions as labSession (labSession)}
					<option value={labSession}>{labSession}</option>
				{/each}
			</select>
		</div>

		<button onclick={startMarking} disabled={!labSessionInput || errors.length !== 0}>
			Start marking
		</button>
		<MessagesList {errors} />
	</form>
</main>
