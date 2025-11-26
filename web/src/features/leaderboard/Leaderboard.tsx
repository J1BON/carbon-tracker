import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      try {
        const response = await apiRequest("/api/v1/gamification/leaderboard?limit=50", "GET");
        return response;
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        return [];
      }
    },
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <Award className="w-5 h-5 text-gray-400" />;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50";
    if (rank === 2) return "bg-gray-500/10 border-gray-500/30 hover:border-gray-500/50";
    if (rank === 3) return "bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50";
    return "bg-white/5 border-white/10 hover:border-white/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Top eco warriors this month
          </p>
        </motion.div>
        
        <div className="glass-card rounded-3xl border border-white/10 p-8">
          <CardHeader className="pb-6 border-b border-white/10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-white tracking-tight">Top Performers</CardTitle>
                <p className="text-gray-400 text-sm mt-1">Rankings based on eco scores and points</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry: any) => (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`group/item flex items-center justify-between p-5 rounded-2xl border ${getRankStyle(entry.rank)} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-md">
                        {getRankIcon(entry.rank)}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-base tracking-tight">
                          {entry.name}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="text-xs font-semibold text-gray-300">
                            {entry.total_points} points
                          </div>
                          {entry.avatar_url && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                              {entry.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg text-white">
                        {entry.eco_score?.toFixed(0) || 0}/100
                      </div>
                      <div className="text-xs font-semibold text-gray-400 mt-0.5">Eco Score</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-base font-medium">No rankings yet</p>
                <p className="text-gray-500 text-sm mt-2">Start tracking to compete!</p>
              </div>
            )}
          </CardContent>
        </div>
      </main>
      <Footer />
    </div>
  );
}

