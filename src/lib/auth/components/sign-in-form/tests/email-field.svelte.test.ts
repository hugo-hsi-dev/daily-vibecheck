import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import EmailField from '../email-field.svelte';

describe('EmailField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: undefined,
				inputProps: {
					name: 'email',
					type: 'email',
					required: true
				}
			});

			await expect.element(page.getByText('Email').first()).toBeInTheDocument();
			await expect.element(page.getByText('The email you used to sign up')).toBeInTheDocument();
		});

		it('should render input with correct attributes', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: undefined,
				inputProps: {
					name: 'email',
					type: 'email',
					required: true,
					value: ''
				}
			});

			const input = page.getByRole('textbox', { name: 'Email' });
			await expect.element(input).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('id', 'email');
			await expect.element(input).toHaveAttribute('type', 'email');
			await expect.element(input).toHaveAttribute('placeholder', 'you@example.com');
		});
	});

	describe('Validation Errors', () => {
		it('should not display errors when issues is undefined', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: undefined,
				inputProps: {
					name: 'email',
					type: 'email',
					required: true
				}
			});

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});

		it('should not display errors when issues is empty array', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: [],
				inputProps: {
					name: 'email',
					type: 'email',
					required: true
				}
			});

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});

		it('should display a single validation error', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: [
					{
						message: 'Invalid email format'
					}
				],
				inputProps: {
					name: 'email',
					type: 'email',
					required: true,
					'aria-invalid': true
				}
			});

			await expect.element(page.getByText('Invalid email format')).toBeInTheDocument();
		});

		it('should display multiple validation errors', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: [
					{
						message: 'Invalid email format'
					},
					{
						message: 'Email is required'
					}
				],
				inputProps: {
					name: 'email',
					type: 'email',
					required: true,
					'aria-invalid': true
				}
			});

			await expect.element(page.getByText('Invalid email format')).toBeInTheDocument();
			await expect.element(page.getByText('Email is required')).toBeInTheDocument();
		});
	});

	describe('User Interaction', () => {
		it('should accept user input', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: undefined,
				inputProps: {
					name: 'email',
					type: 'email',
					required: true,
					value: ''
				}
			});

			const input = page.getByRole('textbox', { name: 'Email' });
			await input.fill('test@example.com');

			await expect.element(input).toHaveValue('test@example.com');
		});

		it('should render with pre-filled value', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: undefined,
				inputProps: {
					name: 'email',
					type: 'email',
					required: true,
					value: 'prefilled@example.com'
				}
			});

			const input = page.getByRole('textbox', { name: 'Email' });
			await expect.element(input).toHaveValue('prefilled@example.com');
		});
	});

	describe('Accessibility', () => {
		it('should have aria-invalid when there are validation errors', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: [
					{
						message: 'Invalid email format'
					}
				],
				inputProps: {
					name: 'email',
					type: 'email',
					required: true,
					'aria-invalid': true
				}
			});

			const input = page.getByRole('textbox', { name: 'Email' });
			await expect.element(input).toHaveAttribute('aria-invalid', 'true');
		});

		it('should not have aria-invalid when there are no errors', async () => {
			expect.hasAssertions();

			render(EmailField, {
				issues: undefined,
				inputProps: {
					name: 'email',
					type: 'email',
					required: true
				}
			});

			const input = page.getByRole('textbox', { name: 'Email' });
			await expect.element(input).not.toHaveAttribute('aria-invalid', 'true');
		});
	});
});
