import { form } from '$app/server';
import * as v from 'valibot';
import { auth } from '$lib/auth';
import { db } from '$lib/server/db';

const signupSchema = v.pipe(
	v.object({
		name: v.pipe(v.string(), v.nonEmpty('Name is required')),
		email: v.pipe(v.string(), v.email('Invalid email address')),
		password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
		confirmPassword: v.pipe(v.string(), v.nonEmpty('Please confirm your password'))
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['confirmPassword']],
			(input) => input.password === input.confirmPassword,
			'Passwords do not match'
		),
		['confirmPassword']
	)
);

export const signup = form(signupSchema, async (data, invalid) => {
	const existingUser = await db.query.user.findFirst({
		where: (table, { eq }) => eq(table.email, data.email)
	});

	if (existingUser) {
		return invalid(invalid.email('Email already exists'));
	}

	const result = await auth.api.signUpEmail({
		body: {
			name: data.name,
			email: data.email,
			password: data.password
		}
	});

	return { success: true, user: result.user };
});

const signinSchema = v.object({
	email: v.pipe(v.string(), v.email('Invalid email address')),
	password: v.pipe(v.string(), v.nonEmpty('Password is required'))
});

export const signin = form(signinSchema, async (data) => {
	const result = await auth.api.signInEmail({
		body: {
			email: data.email,
			password: data.password
		}
		// headers: event.request.headers
	});

	return { success: true, user: result.user };
});
