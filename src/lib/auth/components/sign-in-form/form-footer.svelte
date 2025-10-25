<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { signIn } from '../../remotes/index.remote';
</script>

<Field.Field orientation="responsive">
	<Button type="submit" disabled={signIn.pending !== 0}>
		{signIn.pending !== 0 ? 'Signing in...' : 'Sign in'}
	</Button>
	<Button variant="link" href={resolve('/auth/sign-up')}>Don't have an account?</Button>
</Field.Field>
