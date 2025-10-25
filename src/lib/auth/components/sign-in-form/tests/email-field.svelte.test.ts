import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import EmailField from '../email-field.svelte';

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

describe('EmailField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(EmailField);

			await expect.element(page.getByText('Email').first()).toBeInTheDocument();
			await expect.element(page.getByText('The email you used to sign up')).toBeInTheDocument();
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
		it('should not display errors with empty issues array', async () => {
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
