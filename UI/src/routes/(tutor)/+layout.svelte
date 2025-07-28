<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import MarkingState from '$lib/components/MarkingState.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';
	import { logError } from '$lib/logs/format';
	import {
		StudentSchema,
		labNumberBeingMarked,
		labSessionBeingMarked,
		students,
		type Student
	} from '$lib/store';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	let studentPhotosUrls = $state<string[]>([]);
	let errors = $state<string[]>([]);

	$effect(() => {
		let parsedStudentsData: Student[] = [];

		data.students.forEach((studentData) => {
			try {
				const parsedStudentData = StudentSchema.parse(studentData);
				parsedStudentsData.push(parsedStudentData);
			} catch (e) {
				console.error(
					`This student's data was not in a valid format: ${JSON.stringify(studentData)}`
				);
				try {
					logError(
						'student not shown in list',
						`student data not valid: ${JSON.stringify(studentData)} causing this error: ${e}`
					);
				} catch (e1: any) {
					// if doesn't save log in db, then at least show the user!
					errors.push(e1);
				}
			}
		});
		students.set(parsedStudentsData);

		studentPhotosUrls = $students.map((student) => `/api/student-photo/${student.AUID}`);
	});

	$effect(() => {
		if (!$labNumberBeingMarked || !$labSessionBeingMarked) goto('/pick-lab');
	});
</script>

<svelte:head>
	{#each studentPhotosUrls as image}
		<link rel="preload" as="image" href={image} />
	{/each}
</svelte:head>

<div class="flex flex-col overflow-hidden" style="height: calc(100vh - 5rem)">
	<MarkingState />
	<div class="min-h-0 flex-1">
		{@render children()}
	</div>
	<MessagesList {errors} />
</div>
