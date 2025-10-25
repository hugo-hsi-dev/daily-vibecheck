<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';

	let { pending }: { pending: number } = $props();
</script>

<Field.Separator />
<Field.Field orientation="responsive">
	<Button type="submit" disabled={pending !== 0}>
		{pending !== 0 ? 'Creating account...' : 'Create account'}
	</Button>
	<Button variant="link" href={resolve('/auth/sign-in')}>Already have an account?</Button>
</Field.Field>
