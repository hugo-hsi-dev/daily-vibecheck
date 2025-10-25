<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { signIn } from '../../remotes/index.remote';
</script>

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
