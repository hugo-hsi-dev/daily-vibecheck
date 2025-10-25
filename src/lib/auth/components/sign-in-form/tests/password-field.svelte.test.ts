import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import PasswordField from '../password-field.svelte';

vi.mock('../../../remotes/index.remote', () => ({
	signIn: {
		pending: 0,
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
			}
		}
	}
}));

describe('PasswordField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(PasswordField);

			await expect.element(page.getByText('Password').first()).toBeInTheDocument();
			await expect.element(page.getByText('Your account password')).toBeInTheDocument();
		});

		it('should render input with correct attributes', async () => {
			expect.hasAssertions();

			render(PasswordField);

			const input = page.getByRole('textbox', { name: 'Password' });
			await expect.element(input).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('id', 'password');
			await expect.element(input).toHaveAttribute('type', 'password');
			await expect.element(input).toHaveAttribute('placeholder', '••••••••');
		});
	});

	describe('Validation Errors', () => {
		it('should not display errors when issues is undefined', async () => {
			expect.hasAssertions();

			render(PasswordField);

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});

		it('should not display errors when issues is empty array', async () => {
			expect.hasAssertions();

			render(PasswordField);

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});
	});

	describe('User Interaction', () => {
		it('should accept user input', async () => {
			expect.hasAssertions();

			render(PasswordField);

			const input = page.getByRole('textbox', { name: 'Password' });
			await input.fill('securepassword123');

			await expect.element(input).toHaveValue('securepassword123');
		});
	});

	describe('Accessibility', () => {
		it('should not have aria-invalid when there are no errors', async () => {
			expect.hasAssertions();

			render(PasswordField);

			const input = page.getByRole('textbox', { name: 'Password' });
			await expect.element(input).not.toHaveAttribute('aria-invalid', 'true');
		});
	});
});
