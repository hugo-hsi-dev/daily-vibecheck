import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import ConfirmPasswordField from '../confirm-password-field.svelte';

describe('ConfirmPasswordField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: undefined,
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true
				}
			});

			await expect.element(page.getByText('Confirm password').first()).toBeInTheDocument();
			await expect.element(page.getByText('Enter your password again')).toBeInTheDocument();
		});

		it('should render input with correct attributes', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: undefined,
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true,
					value: ''
				}
			});

			const input = page.getByLabelText('Confirm password');
			await expect.element(input).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('id', 'confirm-password');
			await expect.element(input).toHaveAttribute('type', 'password');
			await expect.element(input).toHaveAttribute('placeholder', '••••••••');
		});
	});

	describe('Validation Errors', () => {
		it('should not display errors when issues is undefined', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: undefined,
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true
				}
			});

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});

		it('should not display errors when issues is empty array', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: [],
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true
				}
			});

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});

		it('should display password mismatch error', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: [
					{
						message: 'Passwords do not match'
					}
				],
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true,
					'aria-invalid': true
				}
			});

			await expect.element(page.getByText('Passwords do not match')).toBeInTheDocument();
		});

		it('should display multiple validation errors', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: [
					{
						message: 'Confirm password is required'
					},
					{
						message: 'Passwords do not match'
					}
				],
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true,
					'aria-invalid': true
				}
			});

			await expect.element(page.getByText('Confirm password is required')).toBeInTheDocument();
			await expect.element(page.getByText('Passwords do not match')).toBeInTheDocument();
		});
	});

	describe('User Interaction', () => {
		it('should accept user input', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: undefined,
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true,
					value: ''
				}
			});

			const input = page.getByLabelText('Confirm password');
			await input.fill('securePassword123');

			await expect.element(input).toHaveValue('securePassword123');
		});

		it('should render with pre-filled value', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: undefined,
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true,
					value: 'existingPassword'
				}
			});

			const input = page.getByLabelText('Confirm password');
			await expect.element(input).toHaveValue('existingPassword');
		});

		it('should mask password input', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: undefined,
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true,
					value: ''
				}
			});

			const input = page.getByLabelText('Confirm password');
			await expect.element(input).toHaveAttribute('type', 'password');
		});
	});

	describe('Accessibility', () => {
		it('should have aria-invalid when there are validation errors', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: [
					{
						message: 'Passwords do not match'
					}
				],
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true,
					'aria-invalid': true
				}
			});

			const input = page.getByLabelText('Confirm password');
			await expect.element(input).toHaveAttribute('aria-invalid', 'true');
		});

		it('should not have aria-invalid when there are no errors', async () => {
			expect.hasAssertions();

			render(ConfirmPasswordField, {
				issues: undefined,
				inputProps: {
					name: 'confirmPassword',
					type: 'password',
					required: true
				}
			});

			const input = page.getByLabelText('Confirm password');
			await expect.element(input).not.toHaveAttribute('aria-invalid', 'true');
		});
	});
});
