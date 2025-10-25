<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field';
	import { resolve } from '$app/paths';
	import { signUp } from '../../remotes/index.remote';
</script>

<Field.Separator />
<Field.Field orientation="responsive">
	<Button type="submit" disabled={signUp.pending !== 0}>
		{signUp.pending !== 0 ? 'Creating account...' : 'Create account'}
	</Button>
	<Button variant="link" href={resolve('/auth/sign-in')}>Already have an account?</Button>
</Field.Field>
