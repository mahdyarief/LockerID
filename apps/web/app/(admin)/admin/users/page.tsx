'use client';

import { trpc } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, User as UserIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const usersQuery = trpc.superAdmin.listUsers.useQuery();

  if (usersQuery.isLoading) {
    return (
      <div className="container mx-auto py-8 px-6">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  const users = usersQuery.data ?? [];

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-2">
          View all registered users in the system
        </p>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users yet</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {user.name || user.email}
                      <Badge
                        variant={user.role === 'superadmin' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {user.role === 'superadmin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Superadmin
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-3 w-3 mr-1" />
                            User
                          </>
                        )}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Storage Used:</span>
                    <div className="font-medium">
                      {formatBytes(user.storageUsed)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Storage Limit:</span>
                    <div className="font-medium">
                      {formatBytes(user.storageLimit)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <div className="font-medium">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
