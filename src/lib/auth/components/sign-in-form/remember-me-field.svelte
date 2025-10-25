<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Field from '$lib/components/ui/field';
	import { signIn } from '../../remotes/index.remote';
</script>

<Field.Field orientation="horizontal">
	<Checkbox {...signIn.fields.rememberMe.as('checkbox')} id="remember-me" type={undefined} />

	<Field.Label for="remember-me">Remember me</Field.Label>
</Field.Field>
