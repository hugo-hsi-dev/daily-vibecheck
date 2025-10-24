import { eq } from 'drizzle-orm';
import { user } from '$lib/server/db/auth-schema';
import type { z } from 'zod';
import type { signInSchema, signUpSchema } from '../schemas';
import type { db } from '$lib/server/db';
import type { auth } from '$lib/auth';
import type { Invalid } from '@sveltejs/kit';

/**
 * Pure business logic for auth mutations.
 * These functions use dependency injection for testability.
 */

type SignUpDeps = {
	db: typeof db;
	auth: typeof auth;
	data: z.infer<typeof signUpSchema>;
	invalid: Invalid<z.infer<typeof signUpSchema>>;
};

export async function signUpLogic({ db, auth, data, invalid }: SignUpDeps) {
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

type SignInDeps = {
	auth: typeof auth;
	data: z.infer<typeof signInSchema>;
};

export async function signInLogic({ auth, data }: SignInDeps) {
	await auth.api.signInEmail({
		body: data
	});
}
