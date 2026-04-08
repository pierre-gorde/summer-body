import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Authenticated users (one row per Google account that has signed in).
 * The full nutrition profile lives in a separate table added later.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  googleSub: text('google_sub').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
