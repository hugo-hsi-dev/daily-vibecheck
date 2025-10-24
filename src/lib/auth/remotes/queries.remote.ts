import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';

export const getUser = query(() => {
	const event = getRequestEvent();
	return event.locals.user;
});

export const validateUser = query(async () => {
	const user = await getUser();
	if (!user) {
		throw error(401, 'Unauthorized');
	}
	return user;
});
