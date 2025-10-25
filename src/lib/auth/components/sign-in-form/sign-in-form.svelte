<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { signIn } from '../../remotes/index.remote';

	import EmailField from './email-field.svelte';
	import PasswordField from './password-field.svelte';
	import RememberMeField from './remember-me-field.svelte';
	import FormFooter from './form-footer.svelte';
	import FormHeader from './form-header.svelte';
</script>

<form {...signIn} novalidate>
	<Field.Group>
		<Field.Set>
			<FormHeader />
			<Field.Separator />
			<Field.Group>
				<EmailField />
				<PasswordField />
				<RememberMeField />
			</Field.Group>
		</Field.Set>
		<Field.Separator />
		<FormFooter />
	</Field.Group>
</form>
