<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field';
	import { signUp } from '../../remotes/index.remote';
</script>

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
