<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleSignin() {
		error = '';

		if (!email || !password) {
			error = 'Email and password are required';
			return;
		}

		loading = true;

		try {
			await authClient.signIn.email({
				email,
				password
			});

			// Redirect to dashboard on successful signin
			await goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Sign in failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
				Sign in to your account
			</h2>
		</div>

		<form class="space-y-6" on:submit|preventDefault={handleSignin}>
			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<p class="text-sm font-medium text-red-800">{error}</p>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">
					Email address
				</label>
				<input
					id="email"
					type="email"
					required
					bind:value={email}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					id="password"
					type="password"
					required
					bind:value={password}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-md bg-blue-600 py-2 px-4 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>

		<p class="text-center text-sm text-gray-600">
			Don't have an account?
			<a href="/auth/signup" class="font-medium text-blue-600 hover:text-blue-500">
				Sign up
			</a>
		</p>
	</div>
</div>
