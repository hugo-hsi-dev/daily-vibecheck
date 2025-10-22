<script lang="ts">
	import { signup } from '../actions.remote';
	import { resolve } from '$app/paths';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
				Create your account
			</h2>
		</div>

		<form class="space-y-6" {...signup}>
			<!-- Form-level errors -->
			{#each signup.fields.allIssues() as issue (issue)}
				<div class="rounded-md bg-red-50 p-4">
					<p class="text-sm font-medium text-red-800">{issue.message}</p>
				</div>
			{/each}

			<div>
				<label for="name" class="block text-sm font-medium text-gray-700"> Full Name </label>
				<input
					{...signup.fields.name.as('text')}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="John Doe"
				/>
				{#each signup.fields.name.issues() as issue (issue)}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
				<input
					{...signup.fields.email.as('email')}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="you@example.com"
				/>
				{#each signup.fields.email.issues() as issue (issue)}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
				<input
					{...signup.fields.password.as('password')}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="••••••••"
				/>
				{#each signup.fields.password.issues() as issue (issue)}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
					Confirm Password
				</label>
				<input
					{...signup.fields.confirmPassword.as('password')}
					class="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					placeholder="••••••••"
				/>
				{#each signup.fields.confirmPassword.issues() as issue (issue)}
					<p class="mt-1 text-sm text-red-600">{issue.message}</p>
				{/each}
			</div>

			<button
				type="submit"
				disabled={signup.pending !== 0}
				class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{signup.pending !== 0 ? 'Creating account...' : 'Sign up'}
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
