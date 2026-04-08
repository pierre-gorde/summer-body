import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { type UserRow, users } from '../db/schema.js';
import type { GoogleIdentity } from './google-auth.js';

/**
 * Inserts a new user for the given Google identity, or updates the
 * existing one's profile fields. Returns the resulting row.
 */
export async function upsertUserFromGoogle(identity: GoogleIdentity): Promise<UserRow> {
  const existing = await db.select().from(users).where(eq(users.googleSub, identity.sub)).limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(users)
      .set({
        email: identity.email,
        name: identity.name,
        avatarUrl: identity.picture ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.googleSub, identity.sub))
      .returning();
    if (!updated) throw new Error('Failed to update user after Google sign-in');
    return updated;
  }

  const [inserted] = await db
    .insert(users)
    .values({
      googleSub: identity.sub,
      email: identity.email,
      name: identity.name,
      avatarUrl: identity.picture ?? null,
    })
    .returning();
  if (!inserted) throw new Error('Failed to insert user after Google sign-in');
  return inserted;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}
