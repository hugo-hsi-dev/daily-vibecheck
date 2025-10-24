<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import type { ComponentProps } from 'svelte';

	let {
		issues,
		props
	}: { issues: RemoteFormIssue[] | undefined; props: ComponentProps<typeof Input> } = $props();
</script>

<Field.Field orientation="responsive">
	<Field.Content>
		<Field.Label for="password">Password</Field.Label>
		<Field.Description>Your account password</Field.Description>
		{#each issues as issue (issue.message)}
			<div>
				<Field.Error>{issue.message}</Field.Error>
			</div>
		{/each}
	</Field.Content>
	<Input {...props} id="password" placeholder="••••••••" />
</Field.Field>
