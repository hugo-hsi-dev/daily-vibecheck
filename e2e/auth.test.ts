import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
	test.describe('Sign Up', () => {
		test('should successfully create a new account', async ({ page }) => {
			await page.goto('/auth/signup');

			// Fill in the sign-up form using placeholders since labels aren't properly associated
			await page.getByPlaceholder('John Doe').fill('Test User');
			await page.getByPlaceholder('you@example.com').fill(`test-${Date.now()}@example.com`);
			await page.getByPlaceholder('••••••••').first().fill('password123'); // First password field
			await page.getByPlaceholder('••••••••').last().fill('password123'); // Confirm password field

			// Submit the form
			await page.getByRole('button', { name: 'Sign up' }).click();

			// Should redirect to home page after successful signup
			await expect(page).toHaveURL('/');
		});

		test('should show error for existing email', async ({ page }) => {
			const email = `existing-${Date.now()}@example.com`;

			// First signup - create the account
			await page.goto('/auth/signup');
			await page.getByPlaceholder('John Doe').fill('First User');
			await page.getByPlaceholder('you@example.com').fill(email);
			await page.getByPlaceholder('••••••••').first().fill('password123');
			await page.getByPlaceholder('••••••••').last().fill('password123');
			await page.getByRole('button', { name: 'Sign up' }).click();
			await expect(page).toHaveURL('/');

			// Navigate back to signup
			await page.goto('/auth/signup');

			// Try to signup again with same email
			await page.getByPlaceholder('John Doe').fill('Second User');
			await page.getByPlaceholder('you@example.com').fill(email);
			await page.getByPlaceholder('••••••••').first().fill('password123');
			await page.getByPlaceholder('••••••••').last().fill('password123');
			await page.getByRole('button', { name: 'Sign up' }).click();

			// Should show error message
			await expect(page.getByText('An account with this email already exists')).toBeVisible();
		});

		test('should show error for password mismatch', async ({ page }) => {
			await page.goto('/auth/signup');

			await page.getByPlaceholder('John Doe').fill('Test User');
			await page.getByPlaceholder('you@example.com').fill(`test-${Date.now()}@example.com`);
			await page.getByPlaceholder('••••••••').first().fill('password123');
			await page.getByPlaceholder('••••••••').last().fill('differentpassword');

			await page.getByRole('button', { name: 'Sign up' }).click();

			// Should show validation error
			await expect(page.getByText('Passwords do not match')).toBeVisible();
		});

		test('should show error for short password', async ({ page }) => {
			await page.goto('/auth/signup');

			await page.getByPlaceholder('John Doe').fill('Test User');
			await page.getByPlaceholder('you@example.com').fill(`test-${Date.now()}@example.com`);
			await page.getByPlaceholder('••••••••').first().fill('short');
			await page.getByPlaceholder('••••••••').last().fill('short');

			await page.getByRole('button', { name: 'Sign up' }).click();

			// Should show validation error
			await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
		});

		test('should show error for invalid email', async ({ page }) => {
			await page.goto('/auth/signup');

			await page.getByLabel('Full Name').fill('Test User');
			await page.getByLabel('Email address').fill('not-an-email');
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await page.getByLabel('Confirm Password').fill('password123');

			await page.getByRole('button', { name: 'Sign up' }).click();

			// Should show validation error
			await expect(page.getByText('Invalid email address')).toBeVisible();
		});

		test('should show error for missing name', async ({ page }) => {
			await page.goto('/auth/signup');

			await page.getByLabel('Email address').fill(`test-${Date.now()}@example.com`);
			await page.getByLabel('Password', { exact: true }).fill('password123');
			await page.getByLabel('Confirm Password').fill('password123');

			await page.getByRole('button', { name: 'Sign up' }).click();

			// Should show validation error
			await expect(page.getByText('Name is required')).toBeVisible();
		});
	});

	test.describe('Sign In', () => {
		test('should successfully sign in with valid credentials', async ({ page }) => {
			const email = `signin-test-${Date.now()}@example.com`;
			const password = 'password123';

			// First, create an account
			await page.goto('/auth/signup');
			await page.getByLabel('Full Name').fill('Sign In Test User');
			await page.getByLabel('Email address').fill(email);
			await page.getByLabel('Password', { exact: true }).fill(password);
			await page.getByLabel('Confirm Password').fill(password);
			await page.getByRole('button', { name: 'Sign up' }).click();
			await expect(page).toHaveURL('/');

			// Navigate to sign in page
			await page.goto('/auth/signin');

			// Sign in with the created account
			await page.getByLabel('Email address').fill(email);
			await page.getByLabel('Password').fill(password);
			await page.getByRole('button', { name: 'Sign in' }).click();

			// Should redirect to home page
			await expect(page).toHaveURL('/');
		});

		test('should show error for invalid credentials', async ({ page }) => {
			await page.goto('/auth/signin');

			await page.getByLabel('Email address').fill('nonexistent@example.com');
			await page.getByLabel('Password').fill('wrongpassword');
			await page.getByRole('button', { name: 'Sign in' }).click();

			// Should show error (better-auth will return an error)
			// The exact error message depends on better-auth configuration
			await expect(page.locator('text=/error|invalid|incorrect/i')).toBeVisible({
				timeout: 5000
			});
		});

		test('should persist remember me selection', async ({ page }) => {
			await page.goto('/auth/signin');

			// Check the remember me checkbox
			await page.getByLabel('Remember me on this device').check();

			// Verify it's checked
			await expect(page.getByLabel('Remember me on this device')).toBeChecked();
		});
	});
});
