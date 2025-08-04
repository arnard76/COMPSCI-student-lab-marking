<script lang="ts">
	import { goto } from '$app/navigation';
	import MessagesList from '$lib/components/MessagesList.svelte';
	import { globalSuccesses } from '$lib/globalMessages';
	import { students, type Student } from '$lib/store';
	import Icon from '@iconify/svelte';

	let searchValue = $state<string>();
	let searchInputElement = $state<HTMLInputElement>();
	let filteredStudents = $derived(
		$students.filter((student) => {
			if (!searchValue) return;
			const { AUID, UPI, name, email } = student;
			const studentText = AUID + UPI + name + email;
			if (studentText.toLowerCase().includes(searchValue.toLowerCase())) return true;
			return false;
		})
	);

	const studentPageURL = (AUID: Student['AUID']) => `/student/${AUID}`;
</script>

<main class="p-0! relative flex h-full flex-col">
	<div class="input-container px- flex justify-between gap-2 px-4 py-4">
		<input
			type="search"
			placeholder="Type student name, UPI, AUID, email"
			bind:value={searchValue}
			bind:this={searchInputElement}
		/>
		<Icon
			icon="tabler:search"
			color="var(--color-placeholder)"
			class="cursor-pointer"
			onclick={() => searchInputElement?.focus()}
		/>
	</div>

	<div class="flex-1 overflow-y-auto p-4">
		<table>
			<tbody>
				{#each searchValue ? filteredStudents : $students as student (student.AUID)}
					<tr class="cursor-pointer" onclick={() => goto(studentPageURL(student.AUID))}>
						<td class="w-full text-pretty leading-[0.85rem] md:w-min md:leading-normal">
							<a href={studentPageURL(student.AUID)}>
								{student.name}
							</a>
						</td>
						<td>
							<a href={studentPageURL(student.AUID)}>
								{student.UPI}
							</a>
						</td>
						<td>
							<a href={studentPageURL(student.AUID)}>
								{student.AUID}
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="absolute bottom-0 m-4">
		<MessagesList success={$globalSuccesses} />
	</div>
	<!-- <AlphabetScrollbar /> -->
</main>
