<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { Checkbox } from '$lib/components/ui/checkbox';

	import { signIn } from '../remotes/mutations.remote';
	import { resolve } from '$app/paths';
</script>

<form {...signIn} novalidate>
	<Field.Group>
		<Field.Set>
			<Field.Legend>Sign in</Field.Legend>
			<Field.Description>Welcome back! Continue your personality journey</Field.Description>
			<Field.Separator />

			<Field.Group>
				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="email">Email</Field.Label>
						<Field.Description>The email you used to sign up</Field.Description>
						{#each signIn.fields.email.issues() as issue (issue.message)}
							<div>
								<Field.Error>{issue.message}</Field.Error>
							</div>
						{/each}
					</Field.Content>
					<Input {...signIn.fields.email.as('email')} id="email" placeholder="you@example.com" />
				</Field.Field>
				<Field.Field orientation="responsive">
					<Field.Content>
						<Field.Label for="password">Password</Field.Label>
						<Field.Description>Your account password</Field.Description>
						{#each signIn.fields.password.issues() as issue (issue.message)}
							<div>
								<Field.Error>{issue.message}</Field.Error>
							</div>
						{/each}
					</Field.Content>
					<Input {...signIn.fields.password.as('password')} id="password" placeholder="••••••••" />
				</Field.Field>

				<Field.Field orientation="horizontal">
					<Checkbox
						{...signIn.fields.rememberMe.as('checkbox')}
						id="remember-me"
						type={undefined}
					/>

					<Field.Label for="remember-me">Remember me</Field.Label>
				</Field.Field>
			</Field.Group>
		</Field.Set>
		<Field.Separator />
		<Field.Field orientation="responsive">
			<Button type="submit" disabled={signIn.pending !== 0}>
				{signIn.pending !== 0 ? 'Signing in...' : 'Sign in'}
			</Button>
			<Button variant="link" href={resolve('/auth/sign-up')}>Don't have an account?</Button>
		</Field.Field>
	</Field.Group>
</form>
