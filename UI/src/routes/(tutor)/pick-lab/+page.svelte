<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';
	import {
		getCurrentLabSessions,
		labSessions,
		labWeeks,
		type LabSession
	} from '$lib/labDefinitions';
	import { labNumberBeingMarked, labSessionBeingMarked } from '$lib/store';

	// TODO: pick a default lab to start marking (based on the week and day)

	let labNumberInput = $state<string | null>($labNumberBeingMarked);
	const currentSessions = getCurrentLabSessions();
	let labSessionInput = $state<LabSession | null>(
		$labSessionBeingMarked || (currentSessions.length ? currentSessions[0] : null)
	);

	let errors = $state<string[]>([]);

	$effect(() => {
		// BUG: TODO: if wrong session is chosen, it doesn't let you fix your mistake :(
		errors = [];
		if (labSessionInput === null) return;
		if (currentSessions.includes(labSessionInput)) return;
		errors.push(`This session doesn't happen today`);
	});

	function startMarking(e: MouseEvent) {
		e.preventDefault();

		if (!labNumberInput || !labSessionInput) return;
		goto('/find-student');
		labNumberBeingMarked.set(labNumberInput);
		labSessionBeingMarked.set(labSessionInput);
	}
</script>

<main>
	<h1>Pick Lab</h1>
	<form class="gap- flex flex-col items-start gap-12">
		<div class="input-group">
			<label for="lab-number-input">Select a lab number (week)</label>
			<select id="lab-number-input" bind:value={labNumberInput}>
				{#each labWeeks as labWeek (labWeek)}
					<option value={labWeek}>{labWeek}</option>
				{/each}
			</select>
		</div>

		<div class="input-group">
			<label for="lab-session-input">Select a lab session (time)</label>
			<select id="lab-session-input" bind:value={labSessionInput}>
				{#each labSessions as labSession (labSession)}
					<option value={labSession}>{labSession}</option>
				{/each}
			</select>
		</div>

		<button
			onclick={startMarking}
			disabled={!labSessionInput || !labNumberInput || errors.length !== 0}
		>
			Start marking
		</button>
		<MessagesList {errors} />
	</form>
</main>
