import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import SignInForm from '../sign-in-form.svelte';

vi.mock('../../../remotes/index.remote', () => ({
	signIn: {
		pending: 0,
		action: '/api/auth/sign-in',
		method: 'POST',
		enctype: 'application/x-www-form-urlencoded',
		fields: {
			email: {
				issues: () => [],
				as: (type: string) => ({
					name: 'email',
					type,
					required: true,
					value: ''
				})
			},
			password: {
				issues: () => [],
				as: (type: string) => ({
					name: 'password',
					type,
					required: true,
					value: ''
				})
			},
			rememberMe: {
				as: (type: string) => ({
					name: 'rememberMe',
					type,
					value: false
				})
			},
			allIssues: () => []
		}
	}
}));

describe('SignInForm Component', () => {
	describe('Rendering', () => {
		it('should render all form fields', async () => {
			expect.hasAssertions();

			render(SignInForm);

			// Header - use description text to avoid duplicate "Sign in"
			await expect
				.element(page.getByText('Welcome back! Continue your personality journey'))
				.toBeInTheDocument();

			// Fields
			await expect.element(page.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
			await expect.element(page.getByRole('textbox', { name: 'Password' })).toBeInTheDocument();
			await expect.element(page.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();

			// Footer
			await expect.element(page.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
		});
	});
});
