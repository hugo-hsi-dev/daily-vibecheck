<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { signUp } from '../../remotes/index.remote';
</script>

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
