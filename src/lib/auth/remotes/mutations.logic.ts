import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Auth } from 'better-auth';
import { eq } from 'drizzle-orm';
import { user } from '$lib/server/db/auth-schema';
import type { z } from 'zod';
import type { signInSchema, signUpSchema } from '../schemas';

/**
 * Pure business logic for auth mutations.
 * These functions use dependency injection for testability.
 */

export interface SignUpLogicDeps {
	db: PostgresJsDatabase<any>;
	auth: Auth;
	data: z.infer<typeof signUpSchema>;
	invalid: {
		email: (message: string) => void;
		(message: string): void;
	};
}

export async function signUpLogic({ db, auth, data, invalid }: SignUpLogicDeps) {
	// Check if user already exists
	const existingUser = await db.select().from(user).where(eq(user.email, data.email));

	if (existingUser.length > 0) {
		return invalid.email('An account with this email already exists');
	}

	// Sign up the user
	await auth.api.signUpEmail({
		body: {
			name: data.name,
			email: data.email,
			password: data.password
		}
	});
}

export interface SignInLogicDeps {
	auth: Auth;
	data: z.infer<typeof signInSchema>;
}

export async function signInLogic({ auth, data }: SignInLogicDeps) {
	await auth.api.signInEmail({
		body: data
	});
}
