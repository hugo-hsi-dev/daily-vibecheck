<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import type { ComponentProps } from 'svelte';

	let {
		issues,
		inputProps
	}: { issues: RemoteFormIssue[] | undefined; inputProps: ComponentProps<typeof Input> } = $props();
</script>

<Field.Field orientation="responsive">
	<Field.Content>
		<Field.Label for="email">Email</Field.Label>
		<Field.Description>The email you used to sign up</Field.Description>
		{#each issues as issue (issue.message)}
			<div>
				<Field.Error>{issue.message}</Field.Error>
			</div>
		{/each}
	</Field.Content>
	<Input {...inputProps} id="email" placeholder="you@example.com" />
</Field.Field>
