<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';

	import * as Field from '$lib/components/ui/field';

	let { pending }: { pending: number } = $props();
</script>

<Field.Field orientation="responsive">
	<Button type="submit" disabled={pending !== 0}>
		{pending !== 0 ? 'Signing in...' : 'Sign in'}
	</Button>
	<Button variant="link" href={resolve('/auth/sign-up')}>Don't have an account?</Button>
</Field.Field>
