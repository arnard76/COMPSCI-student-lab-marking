<script lang="ts">
	import { labNumberBeingMarked, labSessionBeingMarked } from '$lib/store';
	import Modal from './Modal.svelte';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import { type Marks, marksSchema } from '$lib/db-schema/marks';
	import { formatErrorLog } from '$lib/logs/format';
	import CopyToClipboard from './CopyToClipboard.svelte';
	import MessagesList from './MessagesList.svelte';

	let errors = $state<string[]>([]);
	let { onclose } = $props();

	async function getMarks() {
		errors = [];

		try {
			if ($labNumberBeingMarked === null || $labSessionBeingMarked === null) {
				throw formatErrorLog(
					'get current lab marks',
					`lab number is ${$labNumberBeingMarked} and lab session is ${$labSessionBeingMarked}. One of these is undefined.`
				);
			}
		} catch (e: any) {
			errors.push(e);
			return;
		}

		// UPDATE DATABASE
		try {
			const res = await fetch(
				'/api/marks?' +
					new URLSearchParams({
						labSession: $labSessionBeingMarked,
						labNumber: $labNumberBeingMarked
					})
			);
			if (res.status !== 200)
				throw Error(`get marks request failed with code: ${res.status} ::: ${await res.json()}`);
			const studentMarks = await res.json();
			const parsedMarks: Marks[] = studentMarks.map((marksSingle: any) =>
				marksSchema.parse(marksSingle)
			);
			console.log(studentMarks);
			return parsedMarks;
		} catch (e: any) {
			errors.push(formatErrorLog('get current lab marks', `marks not retrieved because: ${e}`));
		}
	}

	let studentMarks = $state<undefined | Marks[]>();
	let studentMarksForExcelScipt = $derived(
		studentMarks?.map((student) => `${student.AUID}|${student.marks}`)
	);
	getMarks().then((res) => (studentMarks = res));
</script>

<Modal {onclose}>
	{#if $labNumberBeingMarked && $labSessionBeingMarked && studentMarksForExcelScipt}
		<div class="flex flex-col gap-2">
			<CopyToClipboard value={$labNumberBeingMarked} />
			<CopyToClipboard value={$labSessionBeingMarked} />

			<CopyToClipboard value={JSON.stringify(studentMarksForExcelScipt)}>
				<JsonView json={studentMarksForExcelScipt} />
			</CopyToClipboard>
		</div>
	{/if}

	<MessagesList {errors} />
</Modal>
