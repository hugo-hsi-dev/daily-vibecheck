import { form } from '$app/server';

import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth-schema';
import { eq } from 'drizzle-orm';
import { signUpSchema, signInSchema } from '../schemas';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export const signUp = form(signUpSchema, async (data, invalid) => {
	// Check if user already exists

	const existingUser = await db.select().from(user).where(eq(user.email, data.email));

	if (existingUser.length > 0) {
		return invalid(invalid.email('An account with this email already exists'));
	}

	// Sign up the user
	await auth.api.signUpEmail({
		body: {
			name: data.name,
			email: data.email,
			password: data.password
		}
	});

	redirect(303, resolve('/'));
});

export const signIn = form(signInSchema, async (data) => {
	await auth.api.signInEmail({
		body: data
	});

	redirect(303, resolve('/'));
});
