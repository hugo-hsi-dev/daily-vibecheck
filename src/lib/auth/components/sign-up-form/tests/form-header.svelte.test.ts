import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import FormHeader from '../form-header.svelte';

describe('FormHeader Component', () => {
	describe('Rendering', () => {
		it('should render the legend text', async () => {
			expect.hasAssertions();

			render(FormHeader);

			await expect.element(page.getByText('Create your account')).toBeInTheDocument();
		});

		it('should render the description text', async () => {
			expect.hasAssertions();

			render(FormHeader);

			await expect
				.element(page.getByText('Start tracking your personality journey'))
				.toBeInTheDocument();
		});
	});

	describe('Visual Structure', () => {
		it('should render all content elements', async () => {
			expect.hasAssertions();

			render(FormHeader);

			// Legend should appear
			await expect.element(page.getByText('Create your account')).toBeInTheDocument();

			// Description should appear after legend
			await expect
				.element(page.getByText('Start tracking your personality journey'))
				.toBeInTheDocument();
		});
	});
});
