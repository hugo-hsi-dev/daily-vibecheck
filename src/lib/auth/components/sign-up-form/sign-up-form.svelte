<script lang="ts">
	import * as Field from '$lib/components/ui/field';
	import { signUp } from '../../remotes/index.remote';

	import FormHeader from './form-header.svelte';
	import NameField from './name-field.svelte';
	import EmailField from './email-field.svelte';
	import PasswordField from './password-field.svelte';
	import ConfirmPasswordField from './confirm-password-field.svelte';
	import FormFooter from './form-footer.svelte';
</script>

<form {...signUp} novalidate>
	<Field.Group>
		<Field.Set>
			<FormHeader />
			<Field.Group>
				<NameField />
				<EmailField />
				<PasswordField />
				<ConfirmPasswordField />
			</Field.Group>
		</Field.Set>
		<FormFooter />
	</Field.Group>
</form>
