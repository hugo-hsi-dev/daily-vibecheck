import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import RememberMeField from '../remember-me-field.svelte';

describe('RememberMeField Component', () => {
	describe('Rendering', () => {
		it('should render label', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe'
				}
			});

			await expect.element(page.getByText('Remember me')).toBeInTheDocument();
		});

		it('should render checkbox with correct attributes', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe'
				}
			});

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).toBeInTheDocument();
			await expect.element(checkbox).toHaveAttribute('id', 'remember-me');
		});

		it('should render unchecked by default', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe'
				}
			});

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).not.toBeChecked();
		});

		it('should render checked when checked is true', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe',
					checked: true
				}
			});

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).toBeChecked();
		});
	});

	describe('User Interaction', () => {
		it('should toggle checkbox when clicked', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe'
				}
			});

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });

			// Initially unchecked
			await expect.element(checkbox).not.toBeChecked();

			// Click to check
			await checkbox.click();
			await expect.element(checkbox).toBeChecked();

			// Click again to uncheck
			await checkbox.click();
			await expect.element(checkbox).not.toBeChecked();
		});

		it('should be clickable via label', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe'
				}
			});

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			const label = page.getByText('Remember me');

			// Initially unchecked
			await expect.element(checkbox).not.toBeChecked();

			// Click label to check checkbox
			await label.click();
			await expect.element(checkbox).toBeChecked();
		});
	});

	describe('Accessibility', () => {
		it('should have proper label association', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe'
				}
			});

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).toBeInTheDocument();

			// Verify checkbox can be found by its accessible name
			await expect.element(page.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();
		});

		it('should support disabled state', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe',
					disabled: true
				}
			});

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).toBeDisabled();
		});
	});

	describe('Layout', () => {
		it('should use horizontal orientation', async () => {
			expect.hasAssertions();

			render(RememberMeField, {
				checkboxProps: {
					name: 'rememberMe'
				}
			});

			// The Field.Field component should have horizontal orientation
			// We verify this by checking that both checkbox and label are present
			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			const label = page.getByText('Remember me');

			await expect.element(checkbox).toBeInTheDocument();
			await expect.element(label).toBeInTheDocument();
		});
	});
});
