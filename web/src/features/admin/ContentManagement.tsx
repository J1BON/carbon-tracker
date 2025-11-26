import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Using simple state-based tabs instead
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api.ts";
import { Award, Target, MapPin, Trash2, Plus } from "lucide-react";
// Simple toast implementation
const showToast = (title: string, description?: string) => {
  alert(`${title}: ${description || ""}`);
};

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<"badges" | "challenges" | "recycling">("badges");
  const queryClient = useQueryClient();

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

  const deleteBadgeMutation = useMutation({
    mutationFn: async (badgeId: string) => {
      return api.delete(`/api/v1/admin/badges/${badgeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-badges"] });
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
      showToast("Success", "Recycling point deleted successfully");
    },
    onError: (error: any) => {
      showToast("Error", error.response?.data?.detail || "Failed to delete recycling point");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage badges, challenges, and recycling points</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2 border-b">
            <Button
              variant={activeTab === "badges" ? "default" : "ghost"}
              onClick={() => setActiveTab("badges")}
            >
              <Award className="h-4 w-4 mr-2" />
              Badges
            </Button>
            <Button
              variant={activeTab === "challenges" ? "default" : "ghost"}
              onClick={() => setActiveTab("challenges")}
            >
              <Target className="h-4 w-4 mr-2" />
              Challenges
            </Button>
            <Button
              variant={activeTab === "recycling" ? "default" : "ghost"}
              onClick={() => setActiveTab("recycling")}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Recycling Points
            </Button>
          </div>

          {activeTab === "badges" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Badges</CardTitle>
                    <CardDescription>Manage platform badges</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Badge
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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

          {activeTab === "challenges" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Challenges</CardTitle>
                    <CardDescription>Manage platform challenges</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Challenge
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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

          {activeTab === "recycling" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recycling Points</CardTitle>
                    <CardDescription>Manage recycling locations</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Point
                  </Button>
                </div>
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
        </div>
      </div>
    </div>
  );
}

