import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api.ts";
import { Search, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react";

// Simple toast implementation
const showToast = (title: string, description?: string, variant: "default" | "destructive" = "default") => {
  if (variant === "destructive") {
    alert(`Error: ${title}\n${description || ""}`);
  } else {
    alert(`Success: ${title}\n${description || ""}`);
  }
};

interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  is_active: boolean;
  eco_score: number;
  level: number;
  total_points: number;
  created_at: string;
}

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["admin-users", search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        skip: (page * 50).toString(),
        limit: "50",
      });
      if (search) params.append("search", search);
      const response = await api.get(`/api/v1/admin/users?${params}`);
      return response.data;
    },
    retry: 1,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      return api.put(`/api/v1/admin/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      showToast("Success", "User updated successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to update user", "destructive");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return api.delete(`/api/v1/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      showToast("Success", "User deactivated successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to deactivate user", "destructive");
    },
  });

  const toggleAdmin = (user: User) => {
    updateUserMutation.mutate({
      userId: user.id,
      data: { is_admin: !user.is_admin },
    });
  };

  const toggleActive = (user: User) => {
    updateUserMutation.mutate({
      userId: user.id,
      data: { is_active: !user.is_active },
    });
  };

  const deleteUser = (userId: string) => {
    if (confirm("Are you sure you want to deactivate this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading users</p>
          <p className="text-sm mt-2">{(error as any)?.response?.data?.detail || "Please try again later"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all platform users</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
            <CardDescription>Search by name or email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({users?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Points</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          Level {user.level} • {user.eco_score.toFixed(1)} eco score
                        </div>
                      </td>
                      <td className="p-3 text-sm">{user.email}</td>
                      <td className="p-3">
                        {user.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <UserX className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        {user.is_admin ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </td>
                      <td className="p-3 text-sm">{user.total_points}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAdmin(user)}
                            title={user.is_admin ? "Remove admin" : "Make admin"}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(user)}
                            title={user.is_active ? "Deactivate" : "Activate"}
                          >
                            {user.is_active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                            title="Deactivate"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users && users.length === 0 && (
              <div className="text-center py-8 text-gray-500">No users found</div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">Page {page + 1}</span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!users || users.length < 50}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

