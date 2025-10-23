<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';

	import { signUp } from '../remotes/mutations.remote';
</script>

<Field.Set>
	<Field.Legend>Create your account</Field.Legend>
	<Field.Description>Start tracking your personality with Daily Vibecheck</Field.Description>
	<form {...signUp}>
		<Field.Group>
			<Field.Field orientation="responsive">
				<Field.Content>
					<Field.Label for="name">Full Name</Field.Label>
					<Field.Description>What should we call you?</Field.Description>
					{#each signUp.fields.name.issues() as issue (issue)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Content>
				<Input {...signUp.fields.name.as('text')} placeholder="John Doe" />
			</Field.Field>

			<Field.Field orientation="responsive">
				<Field.Content>
					<Field.Label for="email">Email address</Field.Label>
					<Field.Description>We'll use this for your account</Field.Description>
					{#each signUp.fields.email.issues() as issue (issue)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Content>
				<Input {...signUp.fields.email.as('email')} placeholder="you@example.com" />
			</Field.Field>

			<Field.Field orientation="responsive">
				<Field.Content>
					<Field.Label for="password">Password</Field.Label>
					<Field.Description>Must be at least 8 characters</Field.Description>
					{#each signUp.fields.password.issues() as issue (issue)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Content>
				<Input {...signUp.fields.password.as('password')} placeholder="••••••••" />
			</Field.Field>

			<Field.Field orientation="responsive">
				<Field.Content>
					<Field.Label for="confirmPassword">Confirm Password</Field.Label>
					<Field.Description>Re-enter your password to confirm</Field.Description>
					{#each signUp.fields.confirmPassword.issues() as issue (issue)}
						<Field.Error>{issue.message}</Field.Error>
					{/each}
				</Field.Content>
				<Input {...signUp.fields.confirmPassword.as('password')} placeholder="••••••••" />
			</Field.Field>

			<Field.Separator />

			<Field.Field>
				<Button type="submit" disabled={signUp.pending !== 0} class="w-full">
					{signUp.pending !== 0 ? 'Creating account...' : 'Sign up'}
				</Button>
			</Field.Field>
		</Field.Group>
	</form>
</Field.Set>
