<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';

	import { signUp } from '../remotes/mutations.remote';
</script>

<form {...signUp} novalidate>
	<Field.Group>
		<Field.Set>
			<Field.Legend>Create your account</Field.Legend>
			<Field.Description>Start tracking your personality journey</Field.Description>
			<Field.Separator />
			<Field.Group>
				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="name">Name</Field.Label>
						<Field.Description>What should we call you?</Field.Description>
						{#each signUp.fields.name.issues() as issue (issue)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Content>
					<Input {...signUp.fields.name.as('text')} id="name" placeholder="John Doe" />
				</Field.Field>

				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="email">Email</Field.Label>
						<Field.Description>For account access and notifications</Field.Description>
						{#each signUp.fields.email.issues() as issue (issue)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Content>
					<Input {...signUp.fields.email.as('email')} id="email" placeholder="you@example.com" />
				</Field.Field>

				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="password">Password</Field.Label>
						<Field.Description>At least 8 characters</Field.Description>
						{#each signUp.fields.password.issues() as issue (issue)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Content>
					<Input {...signUp.fields.password.as('password')} id="password" placeholder="••••••••" />
				</Field.Field>

				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="confirm-password">Confirm password</Field.Label>
						<Field.Description>Enter your password again</Field.Description>
						{#each signUp.fields.confirmPassword.issues() as issue (issue)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Content>
					<Input
						{...signUp.fields.confirmPassword.as('password')}
						id="confirm-password"
						placeholder="••••••••"
					/>
				</Field.Field>
			</Field.Group>
		</Field.Set>
		<Field.Separator />
		<Field.Field orientation="horizontal">
			<Button type="submit" disabled={signUp.pending !== 0}>
				{signUp.pending !== 0 ? 'Creating account...' : 'Create account'}
			</Button>
			<Button variant="link">Already have an account?</Button>
		</Field.Field>
	</Field.Group>
</form>
