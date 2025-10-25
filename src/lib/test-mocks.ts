import { vi } from 'vitest';
import type { db } from './server/db';
import type { auth } from './auth';

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function createMockDb() {
	return {
		query: {
			user: { findFirst: vi.fn(), findMany: vi.fn() }
		},
		select: vi.fn().mockReturnValue({
			from: vi.fn().mockReturnValue({
				where: vi.fn()
			})
		})
	} satisfies DeepPartial<typeof db>;
}

export function createMockAuth() {
	return {
		api: {
			signUpEmail: Object.assign(vi.fn(), { path: undefined, options: undefined }),
			signInEmail: Object.assign(vi.fn(), { path: undefined, options: undefined })
		}
	} satisfies DeepPartial<typeof auth>;
}
