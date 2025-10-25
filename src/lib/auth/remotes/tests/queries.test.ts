import { describe, expect, it, vi } from 'vitest';
import { getUserLogic, validateUserLogic } from '../queries.logic';
import type { RequestEvent } from '@sveltejs/kit';
import type { getUser } from '../index.remote';

describe('Auth Queries Logic', () => {
	describe('getUserLogic', () => {
		it('should return user from event.locals', () => {
			expect.assertions(1);

			const mockUser = {
				id: '123',
				email: 'test@example.com',
				emailVerified: false,
				name: 'Test User',
				createdAt: new Date(),
				updatedAt: new Date()
			};
			const mockEvent = {
				locals: { user: mockUser }
			} as unknown as RequestEvent;

			const result = getUserLogic({ event: mockEvent });

			expect(result).toBe(mockUser);
		});

		it('should return undefined when no user in locals', () => {
			expect.assertions(1);

			const mockEvent = {
				locals: { user: undefined }
			} as unknown as RequestEvent;

			const result = getUserLogic({ event: mockEvent });

			expect(result).toBeUndefined();
		});
	});

	describe('validateUserLogic', () => {
		it('should return user when authenticated', async () => {
			expect.assertions(1);

			const mockUser = {
				id: '123',
				email: 'test@example.com',
				emailVerified: false,
				name: 'Test User',
				createdAt: new Date(),
				updatedAt: new Date()
			};
			const mockGetUser = vi.fn(async () => mockUser) as unknown as typeof getUser;

			const result = await validateUserLogic({ getUser: mockGetUser });

			expect(result).toBe(mockUser);
		});

		it('should throw 401 error when user is not authenticated', async () => {
			expect.assertions(2);

			const mockGetUser = vi.fn(async () => undefined) as unknown as typeof getUser;

			await expect(validateUserLogic({ getUser: mockGetUser })).rejects.toThrow();

			try {
				await validateUserLogic({ getUser: mockGetUser });
			} catch (error) {
				if (error && typeof error === 'object' && 'status' in error) {
					expect(error.status).toBe(401);
				}
			}
		});

		it('should throw error with "Unauthorized" message', async () => {
			expect.assertions(1);

			const mockGetUser = vi.fn(async () => null) as unknown as typeof getUser;

			try {
				await validateUserLogic({ getUser: mockGetUser });
			} catch (error) {
				if (error && typeof error === 'object' && 'body' in error) {
					const errorWithBody = error as { body: { message: string } };
					expect(errorWithBody.body.message).toBe('Unauthorized');
				}
			}
		});
	});
});
