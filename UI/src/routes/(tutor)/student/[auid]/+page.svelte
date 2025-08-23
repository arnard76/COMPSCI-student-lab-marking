<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import MessagesList from '$lib/components/MessagesList.svelte';
	import { logsSchema, type Logs } from '$lib/db-schema/logs';
	import { marksSchema, type Marks } from '$lib/db-schema/marks';
	import { addMessage } from '$lib/globalMessages';
	import { formatErrorLog, formatLog } from '$lib/logs/format';
	import { labNumberBeingMarked, labSessionBeingMarked, students, type Student } from '$lib/store';
	import dayjs from 'dayjs';

	let student = $derived($students.find(({ AUID }) => AUID === page.params.auid));
	let numberOfMarks = $state<number>();
	let errors = $state<string[]>([]);
	let success = $state<string[]>([]);
	let loading = $state(false);

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
		loading = true;
		errors = [];
		success = [];

		try {
			if (!student) {
				throw formatErrorLog('marked student', `student is undefined: ${student}`);
			}

			if (numberOfMarks === undefined) {
				throw formatErrorLog('marked student', `no marks selected: ${numberOfMarks}`);
			}

			if ($labNumberBeingMarked === null || $labSessionBeingMarked === null) {
				throw formatErrorLog(
					'marked student',
					`lab number is ${$labNumberBeingMarked} and lab session is ${$labSessionBeingMarked}. One of these is undefined.`
				);
			}
		} catch (e: any) {
			loading = false;
			errors.push(e);
			return;
		}

		// LOG MARKS
		const markedTime = dayjs().toISOString();
		const log: Logs = {
			dateTime: markedTime,
			// TODO: replace 'Arnav' with the name of the tutor
			// So have to get tutor name somehow? maybe during login?
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
				throw Error(`log request failed with code: ${res.status} ::: ${await res.json()}`);
		} catch (e: any) {
			errors.push(
				formatErrorLog(
					'marked student',
					formatErrorLog('marked student', `Event not logged because: ${e}`)
				)
			);
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
			const res = await fetch('/api/marks', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(marks)
			});
			if (res.status !== 201)
				throw Error(`add marks request failed with code: ${res.status} ::: ${await res.json()}`);
		} catch (e: any) {
			errors.push(formatErrorLog('marked student', `marks not saved because: ${e}`));
		}

		// save marks locally
		const userDataString =
			'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ marks, log, errors }));
		const downloadEl = document.createElement('a');
		downloadEl.setAttribute('href', userDataString);
		downloadEl.setAttribute(
			'download',
			`${window.location.hostname}${errors.length ? ' Errored' : ''} - ${student.AUID} assigned ${numberOfMarks} marks for ${$labNumberBeingMarked}.json`
		);
		downloadEl.click();
		success.push('Saved marks locally (add to lab spreadsheet manually)');

		if (errors.length === 0) {
			addMessage('success', 'Uploaded and logged marks', 2_000);
			goto(`/find-student`);
		}

		loading = false;
	}
</script>

{#if student}
	<main>
		<img
			class="w-48"
			onerror={({ currentTarget }) => {
				if (!student) return;
				(currentTarget as HTMLImageElement).onerror = null; // prevents looping
				(currentTarget as HTMLImageElement).src = '/placeholder-when-no-student-photo.png';
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
				<button disabled={numberOfMarks === undefined || loading} onclick={submitMarks}>
					Finish marking {student.name.split(' ')[0]}
				</button>
			</div>

			{#if !loading}
				<MessagesList {errors} {success} />
			{/if}
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
