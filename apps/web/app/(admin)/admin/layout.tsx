import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import { headers } from 'next/headers';
import { getDb } from '@locker/database/client';
import { users } from '@locker/database';
import { eq } from 'drizzle-orm';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect('/login');
  }

  const db = getDb();
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (user?.role !== 'superadmin') {
    redirect('/home');
  }

  return <>{children}</>;
}
