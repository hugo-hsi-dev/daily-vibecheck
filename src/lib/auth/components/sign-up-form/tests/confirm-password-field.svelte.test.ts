import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import ConfirmPasswordField from '../confirm-password-field.svelte';

vi.mock('../../../remotes/index.remote', () => ({
	signUp: {
		pending: 0,
		fields: {
			name: {
				issues: () => [],
				as: (type: string) => ({
					name: 'name',
					type,
					required: true,
					value: ''
				})
			},
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
			confirmPassword: {
				issues: () => [],
				as: (type: string) => ({
					name: 'confirmPassword',
					type,
					required: true,
					value: ''
				})
			}
		}
	}
}));

describe('ConfirmPasswordField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField);

			await expect.element(page.getByText('Confirm password').first()).toBeInTheDocument();
			await expect.element(page.getByText('Enter your password again')).toBeInTheDocument();
		});

		it('should render input with correct attributes', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField);

			const input = page.getByLabelText('Confirm password');
			await expect.element(input).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('id', 'confirm-password');
			await expect.element(input).toHaveAttribute('type', 'password');
			await expect.element(input).toHaveAttribute('placeholder', '••••••••');
		});
	});

	describe('Validation Errors', () => {
		it('should not display errors when issues is empty', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField);

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});
	});

	describe('User Interaction', () => {
		it('should accept user input', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField);

			const input = page.getByLabelText('Confirm password');
			await input.fill('securePassword123');

			await expect.element(input).toHaveValue('securePassword123');
		});

		it('should mask password input', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField);

			const input = page.getByLabelText('Confirm password');
			await expect.element(input).toHaveAttribute('type', 'password');
		});
	});
});
