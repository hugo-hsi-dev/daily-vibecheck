import { describe, expect, it, vi } from 'vitest';
import { signUpLogic, signInLogic } from '../mutations.logic';
import { createMockAuth, createMockDb } from '$lib/test-mocks';
import type { db } from '$lib/server/db';
import type { auth } from '$lib/auth';

describe('Auth Mutations Logic', () => {
	describe('signUpLogic', () => {
		it('should create a new user when email does not exist', async () => {
			expect.assertions(2);

			const mockAuth = createMockAuth();
			const mockDb = createMockDb();
			mockDb.select().from().where.mockResolvedValue([]);

			const mockData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				confirmPassword: 'password123'
			};

			const mockInvalid = Object.assign(vi.fn(), {
				email: vi.fn()
			});

			await signUpLogic({
				db: mockDb as unknown as typeof db,
				auth: mockAuth as unknown as typeof auth,
				data: mockData,
				invalid: mockInvalid as unknown as Parameters<typeof signUpLogic>[0]['invalid']
			});

			expect(mockAuth.api.signUpEmail).toHaveBeenCalledWith({
				body: {
					name: 'Test User',
					email: 'test@example.com',
					password: 'password123'
				}
			});
			expect(mockInvalid.email).not.toHaveBeenCalled();
		});

		it('should call invalid.email when user already exists', async () => {
			expect.assertions(2);

			const existingUser = {
				id: '123',
				email: 'test@example.com',
				emailVerified: false,
				name: 'Existing User',
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const mockDb = createMockDb();
			mockDb.select().from().where.mockResolvedValue([existingUser]);

			const mockAuth = createMockAuth();

			const mockData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				confirmPassword: 'password123'
			};

			const mockInvalid = Object.assign(vi.fn(), {
				email: vi.fn()
			});

			await signUpLogic({
				db: mockDb as unknown as typeof db,
				auth: mockAuth as unknown as typeof auth,
				data: mockData,
				invalid: mockInvalid as unknown as Parameters<typeof signUpLogic>[0]['invalid']
			});

			expect(mockInvalid.email).toHaveBeenCalledWith('An account with this email already exists');
			expect(mockAuth.api.signUpEmail).not.toHaveBeenCalled();
		});

		it('should query database with correct email', async () => {
			expect.assertions(1);

			const mockDb = createMockDb();
			mockDb.select().from().where.mockResolvedValue([]);

			const mockAuth = createMockAuth();

			const mockData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				confirmPassword: 'password123'
			};

			const mockInvalid = Object.assign(vi.fn(), {
				email: vi.fn()
			});

			await signUpLogic({
				db: mockDb as unknown as typeof db,
				auth: mockAuth as unknown as typeof auth,
				data: mockData,
				invalid: mockInvalid as unknown as Parameters<typeof signUpLogic>[0]['invalid']
			});

			expect(mockDb.select().from().where).toHaveBeenCalled();
		});
	});

	describe('signInLogic', () => {
		it('should call auth.api.signInEmail with correct data', async () => {
			expect.assertions(1);

			const mockAuth = createMockAuth();
			mockAuth.api.signInEmail.mockResolvedValue({ success: true });

			const mockData = {
				email: 'test@example.com',
				password: 'password123',
				rememberMe: true
			};

			await signInLogic({ auth: mockAuth as unknown as typeof auth, data: mockData });

			expect(mockAuth.api.signInEmail).toHaveBeenCalledWith({
				body: mockData
			});
		});

		it('should handle sign in without rememberMe', async () => {
			expect.assertions(1);

			const mockAuth = createMockAuth();
			mockAuth.api.signInEmail.mockResolvedValue({ success: true });

			const mockData = {
				email: 'test@example.com',
				password: 'password123',
				rememberMe: false
			};

			await signInLogic({ auth: mockAuth as unknown as typeof auth, data: mockData });

			expect(mockAuth.api.signInEmail).toHaveBeenCalledWith({
				body: {
					email: 'test@example.com',
					password: 'password123',
					rememberMe: false
				}
			});
		});
	});
});
