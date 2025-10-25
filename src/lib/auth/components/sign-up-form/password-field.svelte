<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { signUp } from '../../remotes/index.remote';
</script>

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
