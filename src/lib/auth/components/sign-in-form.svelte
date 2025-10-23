<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { signIn } from '../remotes/mutations.remote';
</script>

<Field.Set>
	<Field.Legend>Sign In</Field.Legend>
	<Field.Description>Welcome back! Sign in to your Daily Vibecheck account</Field.Description>
	<form {...signIn}>
		<Field.Group>
			<Field.Field orientation="responsive">
				<Field.Content>
					<Field.Label for="email">Email address</Field.Label>
					<Field.Description>The email you used to create your account</Field.Description>
					{#each signIn.fields.email.issues() as issue (issue)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Content>
				<Input {...signIn.fields.email.as('email')} placeholder="you@example.com" />
			</Field.Field>
			<Field.Field orientation="responsive">
				<Field.Content>
					<Field.Label for="password">Password</Field.Label>
					<Field.Description>Enter your password to access your account</Field.Description>
					{#each signIn.fields.password.issues() as issue (issue)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Content>
				<Input {...signIn.fields.password.as('password')} placeholder="••••••••" />
			</Field.Field>
			<Field.Separator />
			<Field.Group>
				<Field.Field orientation="horizontal">
					<Checkbox {...signIn.fields.rememberMe.as('checkbox')} type={undefined} />

					<Field.Label for="rememberMe">Remember me on this device</Field.Label>
				</Field.Field>
			</Field.Group>

			<Field.Field>
				<Button type="submit" disabled={signIn.pending !== 0} class="w-full">
					{signIn.pending !== 0 ? 'Signing in...' : 'Sign in'}
				</Button>
			</Field.Field>
		</Field.Group>
	</form>
</Field.Set>
