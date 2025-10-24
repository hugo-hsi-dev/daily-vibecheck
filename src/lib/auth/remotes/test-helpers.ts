import type { RequestEvent } from '@sveltejs/kit';
import type { vi } from 'vitest';

/**
 * Test helper types for auth remote function tests.
 * These types describe only the properties we use in tests,
 * avoiding 'as any' while maintaining flexibility for mocking.
 */

export type MockDb = {
	select: ReturnType<typeof vi.fn>;
};

export type MockAuth = {
	api: {
		signUpEmail: ReturnType<typeof vi.fn>;
		signInEmail: ReturnType<typeof vi.fn>;
	};
};

export type MockInvalid = {
	(message: string): void;
	email: ReturnType<typeof vi.fn>;
};

export type MockRequestEvent = Pick<RequestEvent, 'locals'>;
