import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import NameField from '../name-field.svelte';

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

describe('NameField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(NameField);

			await expect.element(page.getByText('Name').first()).toBeInTheDocument();
			await expect.element(page.getByText('What should we call you?')).toBeInTheDocument();
		});

		it('should render input with correct attributes', async () => {
			expect.hasAssertions();

			render(NameField);

			const input = page.getByRole('textbox', { name: 'Name' });
			await expect.element(input).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('id', 'name');
			await expect.element(input).toHaveAttribute('type', 'text');
			await expect.element(input).toHaveAttribute('placeholder', 'John Doe');
		});
	});

	describe('Validation Errors', () => {
		it('should not display errors when issues is empty', async () => {
			expect.hasAssertions();

			render(NameField);

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});
	});

	describe('User Interaction', () => {
		it('should accept user input', async () => {
			expect.hasAssertions();

			render(NameField);

			const input = page.getByRole('textbox', { name: 'Name' });
			await input.fill('John Doe');

			await expect.element(input).toHaveValue('John Doe');
		});
	});
});
