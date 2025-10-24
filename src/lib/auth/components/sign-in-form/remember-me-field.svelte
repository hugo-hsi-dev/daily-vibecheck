<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Field from '$lib/components/ui/field';
	import type { ComponentProps } from 'svelte';

	let { checkboxProps }: { checkboxProps: ComponentProps<typeof Checkbox> } = $props();
</script>

<Field.Field orientation="horizontal">
	<Checkbox {...checkboxProps} id="remember-me" type={undefined} />

	<Field.Label for="remember-me">Remember me</Field.Label>
</Field.Field>
