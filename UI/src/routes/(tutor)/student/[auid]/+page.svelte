<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { logsSchema, type Logs } from '$lib/db-schema/logs';
	import { marksSchema, type Marks } from '$lib/db-schema/marks';
	import { formatErrorLog, formatLog } from '$lib/logs/format';
	import { labNumberBeingMarked, labSessionBeingMarked, students, type Student } from '$lib/store';
	import dayjs from 'dayjs';

	let student = $derived($students.find(({ AUID }) => AUID === page.params.auid));
	let numberOfMarks = $state<number>();
	let errors = $state<string[]>([]);
	let success = $state<string[]>([]);

	$effect(() => {
		if (!student) goto(`/find-student`);
	});

	const marksOptions = [
		{ label: 'No marks', value: 0 },
		{ label: '1 mark', value: 1 },
		{ label: '2 marks', value: 2 }
	];

	async function submitMarks(e: MouseEvent) {
		e.preventDefault();
		errors = [];
		success = [];

		if (!student) {
			let errorMessage = formatErrorLog('marked student', `student is undefined: ${student}`);
			errors.push(errorMessage);
			return;
		}

		if (numberOfMarks === undefined) {
			let errorMessage = formatErrorLog('marked student', `no marks selected: ${numberOfMarks}`);
			errors.push(errorMessage);
			return;
		}

		if ($labNumberBeingMarked === null || $labSessionBeingMarked === null) {
			let errorMessage = formatErrorLog(
				'marked student',
				`lab number is ${$labNumberBeingMarked} and lab session is ${$labSessionBeingMarked}. One of these is undefined.`
			);
			errors.push(errorMessage);
			return;
		}

		// LOG MARKS
		const markedTime = dayjs().toISOString();
		const log: Logs = {
			dateTime: markedTime,
			logMessage: formatLog(
				'Arnav',
				$labNumberBeingMarked,
				$labSessionBeingMarked,
				'marked student',
				`successfully assigned ${student.AUID} ${numberOfMarks} marks`
			)
		};
		try {
			logsSchema.parse(log);
			const res = await fetch('/api/log-info', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(log)
			});

			if (res.status !== 201)
				throw Error(
					`Didn't add marks successfully: fetch request failed with code: ${res.status} ::: ${await res.json()}`
				);
		} catch (e: any) {
			errors.push(formatErrorLog('marked student', e));
		}

		// UPDATE DATABASE
		const marks: Marks = {
			AUID: student.AUID,
			marks: numberOfMarks,
			labSession: $labSessionBeingMarked,
			labWeek: $labNumberBeingMarked
		};
		try {
			marksSchema.parse(marks);
			const res = await fetch('/api/add-marks', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(marks)
			});
			if (res.status !== 201)
				throw Error(
					`Didn't add marks successfully: fetch request failed with code: ${res.status} ::: ${await res.json()}`
				);
		} catch (e: any) {
			errors.push(formatErrorLog('marked student', `Couldn't save marks because: ${e}`));
		}

		if (errors.length) {
			// save marks locally
			const userDataString =
				'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ marks, log }));
			const downloadEl = document.createElement('a');
			downloadEl.setAttribute('href', userDataString);
			downloadEl.setAttribute('download', `${student.AUID} assigned ${numberOfMarks} marks.json`);
			downloadEl.click();
			errors.push('Saved marks locally (add to lab spreadsheet manually)');
		} else {
			// if everything goes fine 🙂
			success.push('Uploaded and logged marks');
			setTimeout(() => goto(`/find-student`), 3000);
		}
	}
</script>

{#if student}
	<main>
		<img
			class="w-48"
			onerror={({ currentTarget }) => {
				if (!student) return;
				(currentTarget as HTMLImageElement).onerror = null; // prevents looping
				(currentTarget as HTMLImageElement).src = '';
				(currentTarget as HTMLImageElement).alt = `${student.name} has no student ID photo`;
			}}
			src="/api/student-photo/{student.AUID}"
			alt="Student ID Photo of {student.name}"
		/>
		<h2>{student.name}</h2>
		<a href="mailto:{student.email}">{student.email}</a>
		<p>{student.UPI}</p>
		<p>{student.AUID}</p>

		<form>
			<h3 class="mt-8">Marking tasks</h3>

			<fieldset class="flex gap-2 text-nowrap lg:flex-col" id="marks-allocate-input">
				{#each marksOptions as { label, value } (value)}
					<label class="button-like has-checked:opacity-100 opacity-25 lg:w-64">
						<input type="radio" name="marks-assigned" {value} bind:group={numberOfMarks} />
						{label}
					</label>
				{/each}
			</fieldset>

			<div class=" mt-12 flex w-full justify-center lg:justify-start">
				<button disabled={numberOfMarks === undefined} onclick={submitMarks}>
					Finish marking {student.name.split(' ')[0]}
				</button>
			</div>

			<MessagesList {errors} {success} />
		</form>
	</main>
{/if}

<style lang="postcss">
	#marks-allocate-input .button-like {
		padding-inline: 5px;
		flex: 1;
	}

	#marks-allocate-input input[type='radio'] {
		visibility: hidden;
		height: 0;
		width: 0;
	}
</style>
