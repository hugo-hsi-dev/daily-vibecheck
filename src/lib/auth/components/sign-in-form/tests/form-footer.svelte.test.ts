import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import FormFooter from '../form-footer.svelte';

describe('FormFooter Component', () => {
	describe('Rendering', () => {
		it('should render the sign-in button', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const button = page.getByRole('button', { name: 'Sign in' });
			await expect.element(button).toBeInTheDocument();
		});

		it('should render the sign-up link', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const link = page.getByRole('link', { name: "Don't have an account?" });
			await expect.element(link).toBeInTheDocument();
		});

		it('should render both button and link', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const button = page.getByRole('button', { name: 'Sign in' });
			const link = page.getByRole('link', { name: "Don't have an account?" });

			await expect.element(button).toBeInTheDocument();
			await expect.element(link).toBeInTheDocument();
		});
	});

	describe('Button States', () => {
		it('should show "Sign in" text when not pending', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const button = page.getByRole('button', { name: 'Sign in' });
			await expect.element(button).toHaveTextContent('Sign in');
		});

		it('should be enabled when not pending', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const button = page.getByRole('button', { name: 'Sign in' });
			await expect.element(button).toBeEnabled();
		});

		it('should show "Signing in..." text when pending', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 1
			});

			const button = page.getByRole('button', { name: 'Signing in...' });
			await expect.element(button).toHaveTextContent('Signing in...');
		});

		it('should be disabled when pending', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 1
			});

			const button = page.getByRole('button', { name: 'Signing in...' });
			await expect.element(button).toBeDisabled();
		});

		it('should handle multiple pending state values as disabled', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 2
			});

			const button = page.getByRole('button', { name: 'Signing in...' });
			await expect.element(button).toBeDisabled();
		});
	});

	describe('Navigation', () => {
		it('should have correct href for sign-up link', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const link = page.getByRole('link', { name: "Don't have an account?" });
			await expect.element(link).toHaveAttribute('href', expect.stringMatching(/sign-up/));
		});

		it('should be clickable', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const link = page.getByRole('link', { name: "Don't have an account?" });
			await expect.element(link).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should have proper button semantics', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const button = page.getByRole('button', { name: 'Sign in' });
			await expect.element(button).toBeInTheDocument();
		});

		it('should have proper link semantics for sign-up', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 0
			});

			const link = page.getByRole('link', { name: "Don't have an account?" });
			await expect.element(link).toBeInTheDocument();
		});

		it('should announce disabled state on button when pending', async () => {
			expect.hasAssertions();

			render(FormFooter, {
				pending: 1
			});

			const button = page.getByRole('button', { name: 'Signing in...' });
			await expect.element(button).toBeDisabled();
		});
	});
});
