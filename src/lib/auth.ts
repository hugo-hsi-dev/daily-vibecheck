import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import * as authSchema from '$lib/server/db/auth-schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: authSchema
	}),
	plugins: [sveltekitCookies(getRequestEvent)],
	emailAndPassword: {
		enabled: true
	}
});
