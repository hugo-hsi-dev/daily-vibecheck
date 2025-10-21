import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

export async function handle({ event, resolve }) {
	// Handle better-auth requests
	const response = await svelteKitHandler({
		event,
		resolve,
		auth,
		building
	});

	// Fetch and attach session data to event.locals
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return response;
}
