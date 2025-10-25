<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { signUp } from '../../remotes/index.remote';
</script>

<Field.Field orientation="responsive">
	<Field.Content>
		<Field.Label for="email">Email</Field.Label>
		<Field.Description>For account access and notifications</Field.Description>
		{#each signUp.fields.email.issues() as issue (issue.message)}
			<div>
				<Field.Error>{issue.message}</Field.Error>
			</div>
		{/each}
	</Field.Content>
	<Input {...signUp.fields.email.as('email')} id="email" placeholder="you@example.com" />
</Field.Field>
