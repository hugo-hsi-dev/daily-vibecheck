import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import NameField from '../name-field.svelte';

describe('NameField Component', () => {
	describe('Rendering', () => {
		it('should render label and description', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: undefined,
				inputProps: {
					name: 'name',
					type: 'text',
					required: true
				}
			});

			await expect.element(page.getByText('Name').first()).toBeInTheDocument();
			await expect.element(page.getByText('What should we call you?')).toBeInTheDocument();
		});

		it('should render input with correct attributes', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: undefined,
				inputProps: {
					name: 'name',
					type: 'text',
					required: true,
					value: ''
				}
			});

			const input = page.getByRole('textbox', { name: 'Name' });
			await expect.element(input).toBeInTheDocument();
			await expect.element(input).toHaveAttribute('id', 'name');
			await expect.element(input).toHaveAttribute('type', 'text');
			await expect.element(input).toHaveAttribute('placeholder', 'John Doe');
		});
	});

	describe('Validation Errors', () => {
		it('should not display errors when issues is undefined', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: undefined,
				inputProps: {
					name: 'name',
					type: 'text',
					required: true
				}
			});

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});

		it('should not display errors when issues is empty array', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: [],
				inputProps: {
					name: 'name',
					type: 'text',
					required: true
				}
			});

			const errors = page.getByRole('alert');
			await expect.element(errors).not.toBeInTheDocument();
		});

		it('should display a single validation error', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: [
					{
						message: 'Name is required'
					}
				],
				inputProps: {
					name: 'name',
					type: 'text',
					required: true,
					'aria-invalid': true
				}
			});

			await expect.element(page.getByText('Name is required')).toBeInTheDocument();
		});

		it('should display multiple validation errors', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: [
					{
						message: 'Name is required'
					},
					{
						message: 'Name must be at least 2 characters'
					}
				],
				inputProps: {
					name: 'name',
					type: 'text',
					required: true,
					'aria-invalid': true
				}
			});

			await expect.element(page.getByText('Name is required')).toBeInTheDocument();
			await expect.element(page.getByText('Name must be at least 2 characters')).toBeInTheDocument();
		});
	});

	describe('User Interaction', () => {
		it('should accept user input', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: undefined,
				inputProps: {
					name: 'name',
					type: 'text',
					required: true,
					value: ''
				}
			});

			const input = page.getByRole('textbox', { name: 'Name' });
			await input.fill('John Doe');

			await expect.element(input).toHaveValue('John Doe');
		});

		it('should render with pre-filled value', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: undefined,
				inputProps: {
					name: 'name',
					type: 'text',
					required: true,
					value: 'Jane Smith'
				}
			});

			const input = page.getByRole('textbox', { name: 'Name' });
			await expect.element(input).toHaveValue('Jane Smith');
		});
	});

	describe('Accessibility', () => {
		it('should have aria-invalid when there are validation errors', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: [
					{
						message: 'Name is required'
					}
				],
				inputProps: {
					name: 'name',
					type: 'text',
					required: true,
					'aria-invalid': true
				}
			});

			const input = page.getByRole('textbox', { name: 'Name' });
			await expect.element(input).toHaveAttribute('aria-invalid', 'true');
		});

		it('should not have aria-invalid when there are no errors', async () => {
			expect.hasAssertions();

			render(NameField, {
				issues: undefined,
				inputProps: {
					name: 'name',
					type: 'text',
					required: true
				}
			});

			const input = page.getByRole('textbox', { name: 'Name' });
			await expect.element(input).not.toHaveAttribute('aria-invalid', 'true');
		});
	});
});
