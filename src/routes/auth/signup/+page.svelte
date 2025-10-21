<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let name = '';
	let error = '';
	let loading = false;

	async function handleSignup() {
		error = '';

		if (!email || !password || !confirmPassword || !name) {
			error = 'All fields are required';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return;
		}

		loading = true;

		try {
			await authClient.signUp.email({
				email,
				password,
				name
			});

			// Redirect to dashboard on successful signup
			await goto(resolve('/'));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Sign up failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
				Create your account
			</h2>
		</div>

		<form class="space-y-6" on:submit|preventDefault={handleSignup}>
			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<p class="text-sm font-medium text-red-800">{error}</p>
				</div>
			{/if}

			<div>
				<label for="name" class="block text-sm font-medium text-gray-700"> Full Name </label>
				<input
					id="name"
					type="text"
					required
					bind:value={name}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="John Doe"
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
				<input
					id="email"
					type="email"
					required
					bind:value={email}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
				<input
					id="password"
					type="password"
					required
					bind:value={password}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					type="password"
					required
					bind:value={confirmPassword}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{loading ? 'Creating account...' : 'Sign up'}
			</button>
		</form>

		<p class="text-center text-sm text-gray-600">
			Already have an account?
			<a href={resolve('/auth/signin')} class="font-medium text-blue-600 hover:text-blue-500">
				Sign in
			</a>
		</p>
	</div>
</div>
