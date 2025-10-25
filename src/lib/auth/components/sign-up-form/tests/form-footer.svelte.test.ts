import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import FormFooter from '../form-footer.svelte';

describe('FormFooter Component', () => {
	describe('Rendering', () => {
		it('should render the submit button with default text', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const submitButton = page.getByRole('button', { name: 'Create account' });
			await expect.element(submitButton).toBeInTheDocument();
			await expect.element(submitButton).toHaveAttribute('type', 'submit');
		});

		it('should render the sign-in link', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const signInLink = page.getByRole('link', { name: 'Already have an account?' });
			await expect.element(signInLink).toBeInTheDocument();
			await expect.element(signInLink).toHaveAttribute('href', '/auth/sign-in');
		});
	});

	describe('Visual Structure', () => {
		it('should render all action elements', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			// Submit button should be present
			await expect
				.element(page.getByRole('button', { name: 'Create account' }))
				.toBeInTheDocument();

			// Sign-in link should be present
			await expect
				.element(page.getByRole('link', { name: 'Already have an account?' }))
				.toBeInTheDocument();
		});
	});

	describe('Navigation', () => {
		it('should have correct href for sign-in link', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const signInLink = page.getByRole('link', { name: 'Already have an account?' });
			await expect.element(signInLink).toHaveAttribute('href', '/auth/sign-in');
		});
	});

	describe('Submit Button States', () => {
		it('should not be disabled when not pending', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const submitButton = page.getByRole('button', { name: 'Create account' });
			await expect.element(submitButton).not.toBeDisabled();
		});

		it('should be disabled when pending', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 1
			});

			const submitButton = page.getByRole('button', { name: 'Creating account...' });
			await expect.element(submitButton).toBeInTheDocument();
			await expect.element(submitButton).toBeDisabled();
		});

		it('should show pending text when submitting', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 1
			});

			await expect
				.element(page.getByRole('button', { name: 'Creating account...' }))
				.toBeInTheDocument();
		});
	});
});
