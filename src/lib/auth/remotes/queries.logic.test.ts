import { describe, expect, it, vi } from 'vitest';
import { getUserLogic, validateUserLogic } from './queries.logic';

describe('Auth Queries Logic', () => {
	describe('getUserLogic', () => {
		it('should return user from event.locals', () => {
			expect.assertions(1);

			const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
			const mockEvent = {
				locals: { user: mockUser }
			} as any;

			const result = getUserLogic({ event: mockEvent });

			expect(result).toBe(mockUser);
		});

		it('should return undefined when no user in locals', () => {
			expect.assertions(1);

			const mockEvent = {
				locals: { user: undefined }
			} as any;

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
			} catch (error: any) {
				expect(error.status).toBe(401);
			}
		});

		it('should throw error with "Unauthorized" message', async () => {
			expect.assertions(1);

			const mockGetUser = vi.fn(async () => null);

			try {
				await validateUserLogic({ getUser: mockGetUser });
			} catch (error: any) {
				expect(error.body.message).toBe('Unauthorized');
			}
		});
	});
});
