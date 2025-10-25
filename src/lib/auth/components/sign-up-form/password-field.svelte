<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { signUp } from '../../remotes/index.remote';
</script>

<Field.Field orientation="responsive">
	<Field.Content>
		<Field.Label for="password">Password</Field.Label>
		<Field.Description>At least 8 characters</Field.Description>
		{#each signUp.fields.password.issues() as issue (issue.message)}
			<div>
				<Field.Error>{issue.message}</Field.Error>
			</div>
		{/each}
	</Field.Content>
	<Input {...signUp.fields.password.as('password')} id="password" placeholder="••••••••" />
</Field.Field>
