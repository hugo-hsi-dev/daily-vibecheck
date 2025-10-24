import { describe, expect, it, vi } from 'vitest';
import { signUpLogic, signInLogic } from './mutations.logic';
import type { MockAuth, MockDb, MockInvalid } from './test-helpers';

describe('Auth Mutations Logic', () => {
	describe('signUpLogic', () => {
		it('should create a new user when email does not exist', async () => {
			expect.assertions(2);

			const mockDb: MockDb = {
				select: vi.fn().mockReturnValue({
					from: vi.fn().mockReturnValue({
						where: vi.fn().mockResolvedValue([]) // No existing user
					})
				})
			};

			const mockAuth: MockAuth = {
				api: {
					signUpEmail: vi.fn().mockResolvedValue({ success: true }),
					signInEmail: vi.fn()
				}
			};

			const mockData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				confirmPassword: 'password123'
			};

			const mockInvalid = vi.fn() as MockInvalid;
			mockInvalid.email = vi.fn();

			await signUpLogic({
				db: mockDb,
				auth: mockAuth,
				data: mockData,
				invalid: mockInvalid
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

			const existingUser = { id: '123', email: 'test@example.com' };
			const mockDb: MockDb = {
				select: vi.fn().mockReturnValue({
					from: vi.fn().mockReturnValue({
						where: vi.fn().mockResolvedValue([existingUser]) // User exists
					})
				})
			};

			const mockAuth: MockAuth = {
				api: {
					signUpEmail: vi.fn(),
					signInEmail: vi.fn()
				}
			};

			const mockData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				confirmPassword: 'password123'
			};

			const mockInvalid = vi.fn() as MockInvalid;
			mockInvalid.email = vi.fn();

			await signUpLogic({
				db: mockDb,
				auth: mockAuth,
				data: mockData,
				invalid: mockInvalid
			});

			expect(mockInvalid.email).toHaveBeenCalledWith('An account with this email already exists');
			expect(mockAuth.api.signUpEmail).not.toHaveBeenCalled();
		});

		it('should query database with correct email', async () => {
			expect.assertions(1);

			const mockWhere = vi.fn().mockResolvedValue([]);
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

			const mockDb: MockDb = { select: mockSelect };

			const mockAuth: MockAuth = {
				api: {
					signUpEmail: vi.fn().mockResolvedValue({ success: true }),
					signInEmail: vi.fn()
				}
			};

			const mockData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'password123',
				confirmPassword: 'password123'
			};

			const mockInvalid = vi.fn() as MockInvalid;
			mockInvalid.email = vi.fn();

			await signUpLogic({
				db: mockDb,
				auth: mockAuth,
				data: mockData,
				invalid: mockInvalid
			});

			expect(mockWhere).toHaveBeenCalled();
		});
	});

	describe('signInLogic', () => {
		it('should call auth.api.signInEmail with correct data', async () => {
			expect.assertions(1);

			const mockAuth: MockAuth = {
				api: {
					signInEmail: vi.fn().mockResolvedValue({ success: true }),
					signUpEmail: vi.fn()
				}
			};

			const mockData = {
				email: 'test@example.com',
				password: 'password123',
				rememberMe: true
			};

			await signInLogic({ auth: mockAuth, data: mockData });

			expect(mockAuth.api.signInEmail).toHaveBeenCalledWith({
				body: mockData
			});
		});

		it('should handle sign in without rememberMe', async () => {
			expect.assertions(1);

			const mockAuth: MockAuth = {
				api: {
					signInEmail: vi.fn().mockResolvedValue({ success: true }),
					signUpEmail: vi.fn()
				}
			};

			const mockData = {
				email: 'test@example.com',
				password: 'password123',
				rememberMe: false
			};

			await signInLogic({ auth: mockAuth, data: mockData });

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
