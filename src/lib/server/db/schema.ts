import { pgTable, serial, varchar, timestamp, boolean, text, index } from 'drizzle-orm/pg-core';

// better-auth required tables
export const user = pgTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 255 }),
	email: varchar('email', { length: 255 }).notNull().unique(),
	emailVerified: boolean('emailVerified').default(false),
	image: text('image'),
	createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow()
});

export const session = pgTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('userId', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
	createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow()
});

export const account = pgTable(
	'account',
	{
		id: varchar('id', { length: 255 }).primaryKey(),
		userId: varchar('userId', { length: 255 })
			.notNull()
			.references(() => user.id),
		type: varchar('type', { length: 255 }).notNull(),
		provider: varchar('provider', { length: 255 }).notNull(),
		providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
		refreshToken: text('refreshToken'),
		accessToken: text('accessToken'),
		expiresAt: timestamp('expiresAt', { mode: 'date' }),
		tokenType: varchar('tokenType', { length: 255 }),
		scope: text('scope'),
		idToken: text('idToken'),
		sessionState: text('sessionState'),
		createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow()
	},
	(account) => ({
		userIdIdx: index('account_userId_idx').on(account.userId),
		providerIdx: index('account_provider_idx').on(account.provider)
	})
);

export const verification = pgTable('verification', {
	id: varchar('id', { length: 255 }).primaryKey(),
	identifier: varchar('identifier', { length: 255 }).notNull(),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
	createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow()
});
