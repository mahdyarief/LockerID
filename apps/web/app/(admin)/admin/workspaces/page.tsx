'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2, HardDrive, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminWorkspacesPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<{
    id: string;
    name: string;
    storageLimit: number;
  } | null>(null);
  const [storageInput, setStorageInput] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const workspacesQuery = trpc.superAdmin.listWorkspaces.useQuery();
  const utils = trpc.useUtils();

  const setStorageLimitMutation = trpc.superAdmin.setWorkspaceStorageLimit.useMutation({
    onSuccess: () => {
      toast.success('Storage limit updated');
      utils.superAdmin.listWorkspaces.invalidate();
      setSelectedWorkspace(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteWorkspaceMutation = trpc.superAdmin.deleteWorkspace.useMutation({
    onSuccess: () => {
      toast.success('Workspace deleted');
      utils.superAdmin.listWorkspaces.invalidate();
      setDeleteDialogOpen(false);
      setWorkspaceToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSaveStorage = () => {
    if (!selectedWorkspace) return;
    
    const gbValue = parseFloat(storageInput);
    if (isNaN(gbValue) || gbValue < 0) {
      toast.error('Please enter a valid number');
      return;
    }

    const bytes = Math.floor(gbValue * 1024 * 1024 * 1024);
    setStorageLimitMutation.mutate({
      workspaceId: selectedWorkspace.id,
      storageLimit: bytes,
    });
  };

  const handleDeleteWorkspace = () => {
    if (!workspaceToDelete) return;
    deleteWorkspaceMutation.mutate({ workspaceId: workspaceToDelete.id });
  };

  const openStorageDialog = (workspace: { id: string; name: string; storageLimit: number }) => {
    setSelectedWorkspace(workspace);
    setStorageInput((workspace.storageLimit / (1024 * 1024 * 1024)).toString());
  };

  const openDeleteDialog = (workspace: { id: string; name: string }) => {
    setWorkspaceToDelete(workspace);
    setDeleteDialogOpen(true);
  };

  if (workspacesQuery.isLoading) {
    return (
      <div className="container mx-auto py-8 px-6">
        <div className="text-center">Loading workspaces...</div>
      </div>
    );
  }

  const workspaces = workspacesQuery.data ?? [];

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <p className="text-muted-foreground mt-2">
          Manage all workspaces and storage limits
        </p>
      </div>

      <div className="grid gap-4">
        {workspaces.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No workspaces yet</p>
            </CardContent>
          </Card>
        ) : (
          workspaces.map((workspace) => (
            <Card key={workspace.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {workspace.name}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{workspace.slug}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Owner: {workspace.ownerName || workspace.ownerEmail}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openStorageDialog({
                          id: workspace.id,
                          name: workspace.name,
                          storageLimit: workspace.storageLimit,
                        })
                      }
                    >
                      <HardDrive className="h-4 w-4 mr-2" />
                      Storage
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        openDeleteDialog({
                          id: workspace.id,
                          name: workspace.name,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Storage Used:</span>
                    <div className="font-medium">
                      {formatBytes(workspace.storageUsed)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Storage Limit:</span>
                    <div className="font-medium">
                      {formatBytes(workspace.storageLimit)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Storage Limit Dialog */}
      <Dialog open={!!selectedWorkspace} onOpenChange={() => setSelectedWorkspace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Storage Limit</DialogTitle>
            <DialogDescription>
              Set the maximum storage limit for {selectedWorkspace?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storage-limit">Storage Limit (GB)</Label>
              <Input
                id="storage-limit"
                type="number"
                min="0"
                step="0.1"
                value={storageInput}
                onChange={(e) => setStorageInput(e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedWorkspace(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStorage} disabled={setStorageLimitMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {setStorageLimitMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{workspaceToDelete?.name}</strong>? This action
              cannot be undone and will permanently delete all files, folders, and data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteWorkspace}
              disabled={deleteWorkspaceMutation.isPending}
            >
              {deleteWorkspaceMutation.isPending ? 'Deleting...' : 'Delete Workspace'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
