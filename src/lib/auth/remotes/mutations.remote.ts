import { form } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { signUpSchema, signInSchema } from '../schemas';
import { signUpLogic, signInLogic } from './mutations.logic';

export const signUp = form(signUpSchema, async (data, invalid) => {
	await signUpLogic({ db, auth, data, invalid });
	redirect(303, resolve('/'));
});

export const signIn = form(signInSchema, async (data) => {
	await signInLogic({ auth, data });
	redirect(303, resolve('/'));
});
