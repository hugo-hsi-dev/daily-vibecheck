import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { getUser } from './index.remote';

/**
 * Pure business logic for auth queries.
 * These functions use dependency injection for testability.
 */

type GetUserDeps = {
	event: RequestEvent;
};

export function getUserLogic({ event }: GetUserDeps) {
	return event.locals.user;
}

type ValidateUserDeps = {
	getUser: typeof getUser;
};

export async function validateUserLogic({ getUser }: ValidateUserDeps) {
	const user = await getUser();
	if (!user) {
		throw error(401, 'Unauthorized');
	}
	return user;
}
