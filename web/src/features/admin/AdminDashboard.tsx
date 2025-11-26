import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api.ts";
import { Users, TrendingUp, Award, MapPin, Activity, Shield, BarChart3, Search, Trash2, UserCheck, UserX, Target, Plus, X, FileText, AlertCircle } from "lucide-react";

interface AdminStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  total_carbon_logs: number;
  total_carbon_saved_kg: number;
  total_cfc_reports: number;
  total_badges: number;
  total_challenges: number;
  total_recycling_points: number;
  users_this_month: number;
  carbon_logs_this_month: number;
}

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

// Simple toast implementation
const showToast = (title: string, description?: string, variant: "default" | "destructive" = "default") => {
  if (variant === "destructive") {
    alert(`Error: ${title}\n${description || ""}`);
  } else {
    alert(`Success: ${title}\n${description || ""}`);
  }
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<"stats" | "users" | "content" | "reports">("stats");
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(0);
  const [contentTab, setContentTab] = useState<"badges" | "challenges" | "recycling">("badges");
  const [showBadgeForm, setShowBadgeForm] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [badgeForm, setBadgeForm] = useState({ name: "", description: "", icon: "", rarity: "common", points_required: 0 });
  const [challengeForm, setChallengeForm] = useState({ name: "", description: "", target_value: 0, current_unit: "kg", reward_points: 0, is_active: true });
  const [selectedCFCReport, setSelectedCFCReport] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Statistics
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/api/v1/admin/stats");
      return response.data;
    },
    retry: 1,
  });

  // Users
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery<User[]>({
    queryKey: ["admin-users", userSearch, userPage],
    queryFn: async () => {
      // Check if token exists
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      try {
        const params = new URLSearchParams({
          skip: (userPage * 50).toString(),
          limit: "50",
        });
        if (userSearch) params.append("search", userSearch);
        
        const response = await api.get(`/api/v1/admin/users?${params}`);
        
        // The API returns List[UserResponse] which is directly an array
        // Axios wraps it, so response.data should be the array
        if (!response || !response.data) {
          console.error("Invalid response:", response);
          throw new Error("Invalid response from server");
        }
        
        const data = response.data;
        
        // The endpoint returns a direct array
        if (Array.isArray(data)) {
          return data;
        }
        
        // Fallback: check if wrapped
        if (data && typeof data === 'object') {
          if (Array.isArray(data.data)) {
            return data.data;
          }
          if (Array.isArray(data.users)) {
            return data.users;
          }
        }
        
        console.error("Unexpected response format:", data);
        console.error("Response type:", typeof data);
        console.error("Response keys:", data && typeof data === 'object' ? Object.keys(data) : 'N/A');
        throw new Error("Unexpected response format from server");
      } catch (error: any) {
        console.error("Failed to load users:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Error request:", error.request);
        
        // Handle network errors (no response from server)
        if (!error.response) {
          if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
            throw new Error("Request timeout. The server is taking too long to respond. Please try again.");
          }
          if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
            throw new Error(`Network error: Cannot connect to API server at ${apiUrl}. Please check if the server is running and accessible.`);
          }
          if (error.code === "ERR_CANCELED") {
            throw new Error("Request was cancelled. Please try again.");
          }
          // Generic network error
          throw new Error("Network error: Unable to reach the server. Please check your internet connection and ensure the API server is running.");
        }
        
        // Handle HTTP errors (server responded with error status)
        if (error.response?.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        if (error.response?.status === 403) {
          throw new Error("Access denied. Admin privileges required.");
        }
        if (error.response?.status === 404) {
          throw new Error("Endpoint not found. Please check the API URL.");
        }
        if (error.response?.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }
        
        // Re-throw with more context
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            error.message || 
                            "Failed to load users. Please check your connection and try again.";
        throw new Error(errorMessage);
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Badges
  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ["admin-badges"],
    queryFn: async () => {
      const response = await api.get("/api/v1/admin/badges");
      return response.data;
    },
    retry: 1,
  });

  // Challenges
  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["admin-challenges"],
    queryFn: async () => {
      const response = await api.get("/api/v1/admin/challenges");
      return response.data;
    },
    retry: 1,
  });

  // Recycling Points
  const { data: recyclingPoints, isLoading: pointsLoading } = useQuery({
    queryKey: ["admin-recycling-points"],
    queryFn: async () => {
      const response = await api.get("/api/v1/admin/recycling-points");
      return response.data;
    },
    retry: 1,
  });

  // CFC Reports
  const { data: cfcReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["admin-cfc-reports"],
    queryFn: async () => {
      const response = await api.get("/api/v1/admin/cfc-reports?limit=100");
      return response.data;
    },
    retry: 1,
  });

  // User mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      return api.put(`/api/v1/admin/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      showToast("Success", "User deactivated successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to deactivate user", "destructive");
    },
  });

  // Content mutations
  const deleteBadgeMutation = useMutation({
    mutationFn: async (badgeId: string) => {
      return api.delete(`/api/v1/admin/badges/${badgeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      showToast("Success", "Badge deleted successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to delete badge");
    },
  });

  const deleteChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return api.delete(`/api/v1/admin/challenges/${challengeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      showToast("Success", "Challenge deleted successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to delete challenge");
    },
  });

  const deleteRecyclingPointMutation = useMutation({
    mutationFn: async (pointId: string) => {
      return api.delete(`/api/v1/admin/recycling-points/${pointId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recycling-points"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      showToast("Success", "Recycling point deleted successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to delete recycling point");
    },
  });

  // Create Badge Mutation
  const createBadgeMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new URLSearchParams();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.icon) formData.append("icon", data.icon);
      formData.append("rarity", data.rarity);
      formData.append("points_required", data.points_required.toString());
      return api.post("/api/v1/admin/badges", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setShowBadgeForm(false);
      setBadgeForm({ name: "", description: "", icon: "", rarity: "common", points_required: 0 });
      showToast("Success", "Badge created successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to create badge");
    },
  });

  // Create Challenge Mutation
  const createChallengeMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new URLSearchParams();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("target_value", data.target_value.toString());
      formData.append("current_unit", data.current_unit);
      formData.append("reward_points", data.reward_points.toString());
      formData.append("is_active", data.is_active.toString());
      return api.post("/api/v1/admin/challenges", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-challenges"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setShowChallengeForm(false);
      setChallengeForm({ name: "", description: "", target_value: 0, current_unit: "kg", reward_points: 0, is_active: true });
      showToast("Success", "Challenge created successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to create challenge");
    },
  });

  // Delete CFC Report Mutation
  const deleteCFCReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      return api.delete(`/api/v1/admin/cfc-reports/${reportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cfc-reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      showToast("Success", "CFC report deleted successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to delete CFC report");
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

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      change: `+${stats?.users_this_month || 0} this month`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: stats?.active_users || 0,
      change: `${Math.round(((stats?.active_users || 0) / (stats?.total_users || 1)) * 100)}% active`,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Carbon Saved",
      value: `${(stats?.total_carbon_saved_kg || 0).toFixed(1)} kg`,
      change: `${stats?.carbon_logs_this_month || 0} logs this month`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Admin Users",
      value: stats?.admin_users || 0,
      change: "Administrators",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Badges",
      value: stats?.total_badges || 0,
      change: "Available badges",
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Recycling Points",
      value: stats?.total_recycling_points || 0,
      change: "Locations",
      icon: MapPin,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Control Panel</h1>
          <p className="text-gray-600">Complete platform management in one place</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex gap-2 border-b">
          <Button
            variant={activeSection === "stats" ? "default" : "ghost"}
            onClick={() => setActiveSection("stats")}
            className="rounded-b-none"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistics
          </Button>
          <Button
            variant={activeSection === "users" ? "default" : "ghost"}
            onClick={() => setActiveSection("users")}
            className="rounded-b-none"
          >
            <Users className="h-4 w-4 mr-2" />
            Users ({users?.length || 0})
          </Button>
          <Button
            variant={activeSection === "content" ? "default" : "ghost"}
            onClick={() => setActiveSection("content")}
            className="rounded-b-none"
          >
            <Award className="h-4 w-4 mr-2" />
            Content
          </Button>
          <Button
            variant={activeSection === "reports" ? "default" : "ghost"}
            onClick={() => setActiveSection("reports")}
            className="rounded-b-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            CFC Reports ({cfcReports?.length || 0})
          </Button>
        </div>

        {/* Statistics Section */}
        {activeSection === "stats" && (
          <>
            {statsLoading ? (
              <div className="text-center py-8">Loading statistics...</div>
            ) : statsError ? (
              <div className="text-center text-red-600 py-8">
                <p className="text-lg font-semibold">Error loading statistics</p>
                <p className="text-sm mt-2">{(statsError as any)?.response?.data?.detail || "Please try again later"}</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={idx} className={`${stat.bgColor} border-0 shadow-sm`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </CardTitle>
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {stat.value}
                          </div>
                          <p className="text-xs text-gray-500">{stat.change}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Activity Overview
                      </CardTitle>
                      <CardDescription>Platform activity metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Carbon Logs</span>
                        <span className="font-semibold">{stats?.total_carbon_logs || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CFC Reports</span>
                        <span className="font-semibold">{stats?.total_cfc_reports || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Challenges</span>
                        <span className="font-semibold">{stats?.total_challenges || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Carbon Logs (This Month)</span>
                        <span className="font-semibold text-green-600">
                          {stats?.carbon_logs_this_month || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Growth
                      </CardTitle>
                      <CardDescription>User registration trends</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Users</span>
                        <span className="font-semibold">{stats?.total_users || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="font-semibold text-green-600">
                          {stats?.active_users || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">New Users (This Month)</span>
                        <span className="font-semibold text-blue-600">
                          +{stats?.users_this_month || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Admin Users</span>
                        <span className="font-semibold text-purple-600">
                          {stats?.admin_users || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <>
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
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(0);
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
                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : usersError ? (
                  <div className="text-center text-red-600 py-8">
                    <p className="text-lg font-semibold">Error loading users</p>
                    <p className="text-sm mt-2 max-w-md mx-auto">
                      {usersError instanceof Error ? usersError.message : 
                       (usersError as any)?.response?.data?.detail || 
                       (usersError as any)?.message || 
                       "Please try again later"}
                    </p>
                    {(usersError as any)?.response?.status && (
                      <p className="text-xs mt-2 text-gray-500">
                        Status: {(usersError as any)?.response?.status}
                      </p>
                    )}
                    {!(usersError as any)?.response && (
                      <p className="text-xs mt-2 text-gray-500">
                        Network Error: Unable to reach the server
                      </p>
                    )}
                    <div className="mt-4 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-users"] })}
                      >
                        Retry
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">
                        API URL: {import.meta.env.VITE_API_URL || "http://localhost:8000"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
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
                                    className="cursor-pointer"
                                  >
                                    <Shield className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleActive(user)}
                                    title={user.is_active ? "Deactivate" : "Activate"}
                                    className="cursor-pointer"
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
                                    className="cursor-pointer"
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
                        onClick={() => setUserPage((p) => Math.max(0, p - 1))}
                        disabled={userPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">Page {userPage + 1}</span>
                      <Button
                        variant="outline"
                        onClick={() => setUserPage((p) => p + 1)}
                        disabled={!users || users.length < 50}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Content Section */}
        {activeSection === "content" && (
          <>
            <div className="mb-4 flex gap-2 border-b">
              <Button
                variant={contentTab === "badges" ? "default" : "ghost"}
                onClick={() => setContentTab("badges")}
                className="rounded-b-none"
              >
                <Award className="h-4 w-4 mr-2" />
                Badges ({badges?.length || 0})
              </Button>
              <Button
                variant={contentTab === "challenges" ? "default" : "ghost"}
                onClick={() => setContentTab("challenges")}
                className="rounded-b-none"
              >
                <Target className="h-4 w-4 mr-2" />
                Challenges ({challenges?.length || 0})
              </Button>
              <Button
                variant={contentTab === "recycling" ? "default" : "ghost"}
                onClick={() => setContentTab("recycling")}
                className="rounded-b-none"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Recycling Points ({recyclingPoints?.length || 0})
              </Button>
            </div>

            {contentTab === "badges" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Badges</CardTitle>
                      <CardDescription>Manage platform badges</CardDescription>
                    </div>
                    <Button onClick={() => setShowBadgeForm(!showBadgeForm)}>
                      {showBadgeForm ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Badge
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showBadgeForm && (
                    <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle>Create New Badge</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Name *</label>
                          <Input
                            value={badgeForm.name}
                            onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                            placeholder="Badge name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <Input
                            value={badgeForm.description}
                            onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                            placeholder="Badge description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rarity</label>
                            <select
                              value={badgeForm.rarity}
                              onChange={(e) => setBadgeForm({ ...badgeForm, rarity: e.target.value })}
                              className="w-full p-2 border rounded"
                            >
                              <option value="common">Common</option>
                              <option value="rare">Rare</option>
                              <option value="epic">Epic</option>
                              <option value="legendary">Legendary</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Points Required</label>
                            <Input
                              type="number"
                              value={badgeForm.points_required}
                              onChange={(e) => setBadgeForm({ ...badgeForm, points_required: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Icon (optional)</label>
                          <Input
                            value={badgeForm.icon}
                            onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                            placeholder="Icon identifier"
                          />
                        </div>
                        <Button
                          onClick={() => {
                            if (!badgeForm.name) {
                              showToast("Error", "Name is required", "destructive");
                              return;
                            }
                            createBadgeMutation.mutate(badgeForm);
                          }}
                          disabled={createBadgeMutation.isPending}
                          className="w-full"
                        >
                          {createBadgeMutation.isPending ? "Creating..." : "Create Badge"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  {badgesLoading ? (
                    <div className="text-center py-4">Loading badges...</div>
                  ) : (
                    <div className="space-y-4">
                      {badges && badges.length > 0 ? (
                        badges.map((badge: any) => (
                          <div
                            key={badge.id}
                            className="flex justify-between items-center p-4 border rounded-lg"
                          >
                            <div>
                              <div className="font-semibold">{badge.name}</div>
                              <div className="text-sm text-gray-600">{badge.description}</div>
                              <div className="mt-2 flex gap-2">
                                <Badge variant="outline">{badge.rarity}</Badge>
                                <span className="text-sm text-gray-500">
                                  {badge.points_required} points required
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("Delete this badge?")) {
                                  deleteBadgeMutation.mutate(badge.id);
                                }
                              }}
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No badges found</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {contentTab === "challenges" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Challenges</CardTitle>
                      <CardDescription>Manage platform challenges</CardDescription>
                    </div>
                    <Button onClick={() => setShowChallengeForm(!showChallengeForm)}>
                      {showChallengeForm ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Challenge
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showChallengeForm && (
                    <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle>Create New Challenge</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Name *</label>
                          <Input
                            value={challengeForm.name}
                            onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })}
                            placeholder="Challenge name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <Input
                            value={challengeForm.description}
                            onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                            placeholder="Challenge description"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Target Value *</label>
                            <Input
                              type="number"
                              value={challengeForm.target_value}
                              onChange={(e) => setChallengeForm({ ...challengeForm, target_value: parseFloat(e.target.value) || 0 })}
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Unit</label>
                            <select
                              value={challengeForm.current_unit}
                              onChange={(e) => setChallengeForm({ ...challengeForm, current_unit: e.target.value })}
                              className="w-full p-2 border rounded"
                            >
                              <option value="kg">kg</option>
                              <option value="km">km</option>
                              <option value="days">days</option>
                              <option value="items">items</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Reward Points</label>
                            <Input
                              type="number"
                              value={challengeForm.reward_points}
                              onChange={(e) => setChallengeForm({ ...challengeForm, reward_points: parseInt(e.target.value) || 0 })}
                              placeholder="200"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={challengeForm.is_active}
                            onChange={(e) => setChallengeForm({ ...challengeForm, is_active: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <label className="text-sm font-medium">Active</label>
                        </div>
                        <Button
                          onClick={() => {
                            if (!challengeForm.name) {
                              showToast("Error", "Name is required", "destructive");
                              return;
                            }
                            createChallengeMutation.mutate(challengeForm);
                          }}
                          disabled={createChallengeMutation.isPending}
                          className="w-full"
                        >
                          {createChallengeMutation.isPending ? "Creating..." : "Create Challenge"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  {challengesLoading ? (
                    <div className="text-center py-4">Loading challenges...</div>
                  ) : (
                    <div className="space-y-4">
                      {challenges && challenges.length > 0 ? (
                        challenges.map((challenge: any) => (
                          <div
                            key={challenge.id}
                            className="flex justify-between items-center p-4 border rounded-lg"
                          >
                            <div>
                              <div className="font-semibold">{challenge.name}</div>
                              <div className="text-sm text-gray-600">{challenge.description}</div>
                              <div className="mt-2 flex gap-2">
                                <Badge variant={challenge.is_active ? "default" : "secondary"}>
                                  {challenge.is_active ? "Active" : "Inactive"}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Target: {challenge.target_value} {challenge.current_unit}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Reward: {challenge.reward_points} points
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("Delete this challenge?")) {
                                  deleteChallengeMutation.mutate(challenge.id);
                                }
                              }}
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No challenges found</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {contentTab === "recycling" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recycling Points</CardTitle>
                  <CardDescription>Manage recycling locations</CardDescription>
                </CardHeader>
                <CardContent>
                  {pointsLoading ? (
                    <div className="text-center py-4">Loading recycling points...</div>
                  ) : (
                    <div className="space-y-4">
                      {recyclingPoints && recyclingPoints.length > 0 ? (
                        recyclingPoints.map((point: any) => (
                          <div
                            key={point.id}
                            className="flex justify-between items-center p-4 border rounded-lg"
                          >
                            <div>
                              <div className="font-semibold">{point.name}</div>
                              <div className="text-sm text-gray-600">{point.address}</div>
                              <div className="mt-2 flex gap-2">
                                <Badge variant={point.verified ? "default" : "secondary"}>
                                  {point.verified ? "Verified" : "Unverified"}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {point.waste_types_accepted?.join(", ")}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm("Delete this recycling point?")) {
                                  deleteRecyclingPointMutation.mutate(point.id);
                                }
                              }}
                              className="cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No recycling points found</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* CFC Reports Section */}
        {activeSection === "reports" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>CFC Reports</CardTitle>
                <CardDescription>Click on any report to view details</CardDescription>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="text-center py-8">Loading CFC reports...</div>
                ) : (
                  <div className="space-y-3">
                    {cfcReports && cfcReports.length > 0 ? (
                      cfcReports.map((report: any) => (
                        <div
                          key={report.id}
                          className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                          onClick={() => setSelectedCFCReport(report)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <AlertCircle className={`h-6 w-6 ${
                              report.issue_type === "Gas leak" ? "text-red-600" :
                              report.issue_type === "Disposal" ? "text-orange-600" :
                              "text-blue-600"
                            }`} />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{report.device}</div>
                              <div className="text-sm text-gray-600">{report.issue_type}</div>
                              {report.notes && (
                                <div className="text-sm text-gray-500 mt-1 truncate max-w-md">
                                  {report.notes}
                                </div>
                              )}
                            </div>
                            <Badge variant={
                              report.issue_type === "Gas leak" ? "destructive" :
                              report.issue_type === "Disposal" ? "default" :
                              "secondary"
                            }>
                              {report.issue_type}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {new Date(report.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this CFC report?")) {
                                deleteCFCReportMutation.mutate(report.id);
                              }
                            }}
                            className="cursor-pointer ml-4"
                            title="Delete CFC report"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">No CFC reports found</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CFC Report Detail Modal (Mail-like view) */}
            {selectedCFCReport && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCFCReport(null)}>
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">CFC Report Details</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          selectedCFCReport.issue_type === "Gas leak" ? "destructive" :
                          selectedCFCReport.issue_type === "Disposal" ? "default" :
                          "secondary"
                        }>
                          {selectedCFCReport.issue_type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(selectedCFCReport.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCFCReport(null)}
                      className="cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Device</label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <AlertCircle className={`h-6 w-6 ${
                          selectedCFCReport.issue_type === "Gas leak" ? "text-red-600" :
                          selectedCFCReport.issue_type === "Disposal" ? "text-orange-600" :
                          "text-blue-600"
                        }`} />
                        <span className="text-lg font-medium">{selectedCFCReport.device}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Issue Type</label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-lg">{selectedCFCReport.issue_type}</span>
                    </div>
                  </div>

                  {selectedCFCReport.notes && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Notes</label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg border min-h-[150px]">
                        <p className="text-gray-800 whitespace-pre-wrap">{selectedCFCReport.notes}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Report Date</label>
                      <div className="mt-2 text-gray-600">
                        {selectedCFCReport.date ? new Date(selectedCFCReport.date).toLocaleDateString() : "Not specified"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Submitted</label>
                      <div className="mt-2 text-gray-600">
                        {new Date(selectedCFCReport.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this CFC report?")) {
                          deleteCFCReportMutation.mutate(selectedCFCReport.id);
                          setSelectedCFCReport(null);
                        }
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Report
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCFCReport(null)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}
