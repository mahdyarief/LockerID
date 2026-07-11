import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '@locker/database/client';
import { users, sessions, accounts, verifications } from '@locker/database';
import { count, eq } from 'drizzle-orm';

const db = getDb();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user: users, session: sessions, account: accounts, verification: verifications },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Check if this is the first user in the system
          const [result] = await db.select({ count: count() }).from(users);
          const userCount = result?.count ?? 0;
          const role = userCount === 0 ? 'superadmin' : 'user';
          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
