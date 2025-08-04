<script lang="ts">
	import { goto } from '$app/navigation';
	import { tutorToken } from '$lib/auth/store';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let name = $state<string | undefined>(),
		password = $state<string | undefined>(),
		error = $state<string | undefined>(),
		loading = $state(false);

	const submitHandler = async (e: Event) => {
		e.preventDefault();
		loading = true;
		try {
			const result = await fetch('/api/login', {
				method: 'POST',
				body: JSON.stringify({ name, password })
			});

			if (result.status !== 200) throw Error('Login failed with: ' + (await result.text()));
			const { token } = await result.json();
			tutorToken.set(token);
			localStorage.setItem('tutorToken', token);
			goto('/pick-lab');
		} catch (e: any) {
			error = e;
		}
		loading = false;
	};
</script>

<main>
	<h1>Login</h1>
	<form class="gap- flex flex-col items-start gap-12">
		<div class="input-group">
			<label for="login-name">Name</label>
			<input type="text" id="login-name" placeholder="Enter Name" bind:value={name} required />
		</div>

		<div class="input-group">
			<label for="login-password">Password</label>
			<input
				type="password"
				id="login-password"
				placeholder="Enter Password"
				bind:value={password}
				required
			/>
		</div>

		<button onclick={submitHandler} disabled={loading}>Login</button>

		{#if error && !loading}
			<ErrorMessage>{error}</ErrorMessage>
		{/if}
	</form>
</main>
