import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import EmailField from '../email-field.svelte';

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

describe('EmailField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(EmailField);

			await expect.element(page.getByText('Email').first()).toBeInTheDocument();
			await expect
				.element(page.getByText('For account access and notifications'))
				.toBeInTheDocument();
		});

		it('should render input with correct attributes', async () => {
			expect.hasAssertions();

			render(EmailField);

			const input = page.getByRole('textbox', { name: 'Email' });
			await expect.element(input).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('id', 'email');
			await expect.element(input).toHaveAttribute('type', 'email');
			await expect.element(input).toHaveAttribute('placeholder', 'you@example.com');
		});
	});

	describe('Validation Errors', () => {
		it('should not display errors when issues is empty', async () => {
			expect.hasAssertions();

			render(EmailField);

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});
	});

	describe('User Interaction', () => {
		it('should accept user input', async () => {
			expect.hasAssertions();

			render(EmailField);

			const input = page.getByRole('textbox', { name: 'Email' });
			await input.fill('test@example.com');

			await expect.element(input).toHaveValue('test@example.com');
		});
	});
});
