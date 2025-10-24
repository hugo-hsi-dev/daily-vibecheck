import { describe, expect, it, vi } from 'vitest';
import { getUserLogic, validateUserLogic } from './queries.logic';
import type { MockRequestEvent } from './test-helpers';

describe('Auth Queries Logic', () => {
	describe('getUserLogic', () => {
		it('should return user from event.locals', () => {
			expect.assertions(1);

			const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
			const mockEvent: MockRequestEvent = {
				locals: { user: mockUser }
			};

			const result = getUserLogic({ event: mockEvent });

			expect(result).toBe(mockUser);
		});

		it('should return undefined when no user in locals', () => {
			expect.assertions(1);

			const mockEvent: MockRequestEvent = {
				locals: { user: undefined }
			};

			const result = getUserLogic({ event: mockEvent });

			expect(result).toBeUndefined();
		});
	});

	describe('validateUserLogic', () => {
		it('should return user when authenticated', async () => {
			expect.assertions(1);

			const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
			const mockGetUser = vi.fn(async () => mockUser);

			const result = await validateUserLogic({ getUser: mockGetUser });

			expect(result).toBe(mockUser);
		});

		it('should throw 401 error when user is not authenticated', async () => {
			expect.assertions(2);

			const mockGetUser = vi.fn(async () => undefined);

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

			const mockGetUser = vi.fn(async () => null);

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
