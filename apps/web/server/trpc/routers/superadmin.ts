import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { createRouter, superAdminProcedure } from '../init';
import { workspaces, users } from '@locker/database';

export const superAdminRouter = createRouter({
  // List all workspaces in the system
  listWorkspaces: superAdminProcedure.query(async ({ ctx }) => {
    const allWorkspaces = await ctx.db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        ownerId: workspaces.ownerId,
        ownerName: users.name,
        ownerEmail: users.email,
        storageUsed: workspaces.storageUsed,
        storageLimit: workspaces.storageLimit,
        createdAt: workspaces.createdAt,
      })
      .from(workspaces)
      .leftJoin(users, eq(workspaces.ownerId, users.id))
      .orderBy(desc(workspaces.createdAt));

    return allWorkspaces;
  }),

  // Set storage limit for a workspace
  setWorkspaceStorageLimit: superAdminProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        storageLimit: z.number().min(0), // in bytes
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(workspaces)
        .set({ storageLimit: input.storageLimit })
        .where(eq(workspaces.id, input.workspaceId))
        .returning();

      if (!updated) {
        throw new Error('Workspace not found');
      }

      return updated;
    }),

  // List all users in the system
  listUsers: superAdminProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        storageUsed: users.storageUsed,
        storageLimit: users.storageLimit,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return allUsers;
  }),

  // Delete a workspace (superadmin only)
  deleteWorkspace: superAdminProcedure
    .input(z.object({ workspaceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(workspaces)
        .where(eq(workspaces.id, input.workspaceId))
        .returning();

      if (!deleted) {
        throw new Error('Workspace not found');
      }

      return { success: true };
    }),
});
