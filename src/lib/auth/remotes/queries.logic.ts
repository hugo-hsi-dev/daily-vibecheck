import type { RemoteQueryFunction, RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

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
	getUser: RemoteQueryFunction<
		void,
		| {
				id: string;
				createdAt: Date;
				updatedAt: Date;
				email: string;
				emailVerified: boolean;
				name: string;
				image?: string | null | undefined;
		  }
		| undefined
	>;
};

export async function validateUserLogic({ getUser }: ValidateUserDeps) {
	const user = await getUser();
	if (!user) {
		throw error(401, 'Unauthorized');
	}
	return user;
}
