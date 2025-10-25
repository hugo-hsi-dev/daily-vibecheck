<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { signUp } from '../../remotes/index.remote';
</script>

<Field.Field orientation="responsive">
	<Field.Content>
		<Field.Label for="confirm-password">Confirm password</Field.Label>
		<Field.Description>Enter your password again</Field.Description>
		{#each signUp.fields.confirmPassword.issues() as issue (issue.message)}
			<div>
				<Field.Error>{issue.message}</Field.Error>
			</div>
		{/each}
	</Field.Content>
	<Input
		{...signUp.fields.confirmPassword.as('password')}
		id="confirm-password"
		placeholder="••••••••"
	/>
</Field.Field>
