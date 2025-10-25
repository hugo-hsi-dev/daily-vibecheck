<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { signUp } from '../../remotes/index.remote';
</script>

<Field.Field orientation="responsive">
	<Field.Content>
		<Field.Label for="name">Name</Field.Label>
		<Field.Description>What should we call you?</Field.Description>
		{#each signUp.fields.name.issues() as issue (issue.message)}
			<div>
				<Field.Error>{issue.message}</Field.Error>
			</div>
		{/each}
	</Field.Content>
	<Input {...signUp.fields.name.as('text')} id="name" placeholder="John Doe" />
</Field.Field>
