import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

/**
 * MBTI Dimension definitions:
 * - E/I (Extroversion/Introversion)
 * - S/N (Sensing/Intuition)
 * - T/F (Thinking/Feeling)
 * - J/P (Judging/Perceiving)
 */

export const questions = pgTable('questions', {
	id: uuid('id').primaryKey().defaultRandom(),
	text: text('text').notNull(),
	dimension: text('dimension').notNull(), // 'E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'
	pole: text('pole').notNull(), // The positive pole (e.g., 'Extroversion' for 'E')
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const responses = pgTable('responses', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	questionId: uuid('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'restrict' }),
	// true = agree, false = disagree
	answer: boolean('answer').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const typeHistory = pgTable('type_history', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	// MBTI type: 'INTJ', 'ENFP', etc.
	mbtiType: text('mbti_type').notNull(),
	// Date when this type was calculated/recorded
	recordedAt: timestamp('recorded_at').defaultNow().notNull(),
	// How many responses were used to calculate this type
	responseCount: integer('response_count').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
