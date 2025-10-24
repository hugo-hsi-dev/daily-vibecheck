import { getRequestEvent, query } from '$app/server';
import { getUserLogic, validateUserLogic } from './queries.logic';

export const getUser = query(() => {
	const event = getRequestEvent();
	return getUserLogic({ event });
});

export const validateUser = query(async () => {
	return validateUserLogic({ getUser });
});
