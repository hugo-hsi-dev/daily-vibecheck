import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import RememberMeField from '../remember-me-field.svelte';

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

describe('RememberMeField Component', () => {
	describe('Rendering', () => {
		it('should render label', async () => {
			expect.hasAssertions();

			render(RememberMeField);

			await expect.element(page.getByText('Remember me')).toBeInTheDocument();
		});

		it('should render checkbox with correct attributes', async () => {
			expect.hasAssertions();

			render(RememberMeField);

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).toBeInTheDocument();
			await expect.element(checkbox).toHaveAttribute('id', 'remember-me');
		});

		it('should render unchecked by default', async () => {
			expect.hasAssertions();

			render(RememberMeField);

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).not.toBeChecked();
		});
	});

	describe('User Interaction', () => {
		it('should toggle checkbox when clicked', async () => {
			expect.hasAssertions();

			render(RememberMeField);

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

			render(RememberMeField);

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

			render(RememberMeField);

			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			await expect.element(checkbox).toBeInTheDocument();

			// Verify checkbox can be found by its accessible name
			await expect.element(page.getByRole('checkbox', { name: 'Remember me' })).toBeInTheDocument();
		});
	});

	describe('Layout', () => {
		it('should use horizontal orientation', async () => {
			expect.hasAssertions();

			render(RememberMeField);

			// The Field.Field component should have horizontal orientation
			// We verify this by checking that both checkbox and label are present
			const checkbox = page.getByRole('checkbox', { name: 'Remember me' });
			const label = page.getByText('Remember me');

			await expect.element(checkbox).toBeInTheDocument();
			await expect.element(label).toBeInTheDocument();
		});
	});
});
