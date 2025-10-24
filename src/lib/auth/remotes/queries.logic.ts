import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/**
 * Pure business logic for auth queries.
 * These functions use dependency injection for testability.
 */

export interface GetUserDeps {
	event: RequestEvent;
}

export function getUserLogic({ event }: GetUserDeps) {
	return event.locals.user;
}

export interface ValidateUserDeps {
	getUser: () => Promise<ReturnType<typeof getUserLogic>>;
}

export async function validateUserLogic({ getUser }: ValidateUserDeps) {
	const user = await getUser();
	if (!user) {
		throw error(401, 'Unauthorized');
	}
	return user;
}
