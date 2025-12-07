import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Target, 
  Zap, 
  TrendingDown,
  Calculator,
  MapPin
} from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  savings_kg: number;
  difficulty: "Easy" | "Medium" | "Hard";
  impact: "High" | "Medium" | "Low";
  icon: string;
  category: string;
  bangladesh_specific?: boolean;
}

interface QuickWin {
  title: string;
  description: string;
  savings_kg: number;
  difficulty: "Easy" | "Medium" | "Hard";
  icon: string;
  bangladesh_specific?: boolean;
}

interface ActionableRecommendationsData {
  recommendations: Recommendation[];
  priority_actions?: Recommendation[];  // Top 3 actions ranked by impact
  quick_wins: QuickWin[];
  total_potential_savings_kg: number;
  highest_category?: string;
  highest_category_emissions?: number;
  category_breakdown?: Record<string, number>;
  message?: string;
  ai_insights?: {
    insights: Array<{
      type: string;
      message: string;
      priority: string;
    }>;
    summary: string;
    top_activities?: Array<{
      activity: string;
      emissions_kg: number;
    }>;
  };
}

interface ActionableRecommendationsProps {
  data: ActionableRecommendationsData | null;
  loading?: boolean;
}

const DIFFICULTY_COLORS = {
  Easy: "bg-green-100 border-green-300 text-green-800",
  Medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
  Hard: "bg-orange-100 border-orange-300 text-orange-800",
};

const IMPACT_COLORS = {
  High: "bg-red-100 border-red-300 text-red-800",
  Medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
  Low: "bg-green-100 border-green-300 text-green-800",
};

export default function ActionableRecommendations({ 
  data, 
  loading = false 
}: ActionableRecommendationsProps) {
  if (loading) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin text-blue-600">⏳</div>
            <p className="text-blue-700 font-medium">Loading recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data && !loading) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <CardContent className="p-6">
          <p className="text-blue-700 font-medium">Start tracking your carbon footprint to get personalized recommendations!</p>
        </CardContent>
      </Card>
    );
  }

  if (data && !data.recommendations.length && !data.quick_wins.length) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <CardContent className="p-6">
          <p className="text-blue-700">{data?.message || "Keep tracking your activities to get personalized recommendations!"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Recommendations Card */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">Actionable Recommendations</CardTitle>
              <p className="text-sm text-blue-700 mt-1">
                Personalized tips based on your highest emission category: <strong>{data.highest_category || "N/A"}</strong>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Insights */}
          {data.ai_insights && data.ai_insights.summary && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 mb-1">AI-Powered Insight</h4>
                  <p className="text-sm text-purple-800">{data.ai_insights.summary}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Priority Actions (Top 3) */}
          {data.priority_actions && data.priority_actions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-900 text-lg">🎯 Top 3 Priority Actions</h4>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Ranked by Impact</span>
              </div>
              {data.priority_actions.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 hover:border-blue-500 transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="text-3xl flex-shrink-0">{rec.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h5 className="font-bold text-blue-900 text-lg">{rec.title}</h5>
                        {rec.bangladesh_specific && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 border border-orange-300 text-orange-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            🇧🇩 Bangladesh-Specific
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${IMPACT_COLORS[rec.impact]}`}>
                          {rec.impact} Impact
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${DIFFICULTY_COLORS[rec.difficulty]}`}>
                          {rec.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-700 font-semibold text-sm">💰 Potential Savings:</span>
                          <span className="text-green-800 font-bold text-lg">{rec.savings_kg} kg CO₂/month</span>
                        </div>
                        {index === 0 && (
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 border border-yellow-300 text-yellow-800">
                            ⭐ Highest Impact
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Category Breakdown */}
          {data.highest_category && data.highest_category_emissions && (
            <div className="p-4 bg-white/80 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-blue-700" />
                <h4 className="font-semibold text-blue-900">Your Highest Category</h4>
              </div>
              <p className="text-blue-800">
                <strong>{data.highest_category}</strong>: {data.highest_category_emissions} kg CO₂
              </p>
            </div>
          )}

          {/* All Recommendations List */}
          {data.recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                All Recommendations
              </h4>
              {data.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{rec.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h5 className="font-bold text-blue-900 text-base">{rec.title}</h5>
                        {rec.bangladesh_specific && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 border border-orange-300 text-orange-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Bangladesh-Specific
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${IMPACT_COLORS[rec.impact]}`}>
                          {rec.impact} Impact
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${DIFFICULTY_COLORS[rec.difficulty]}`}>
                          {rec.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-700 font-semibold">💰 Potential Savings:</span>
                        <span className="text-green-800 font-bold">{rec.savings_kg} kg CO₂/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Wins Card */}
      {data.quick_wins.length > 0 && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg text-green-900">Quick Wins</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 mb-4">Easy changes with big impact:</p>
            <div className="space-y-2">
              {data.quick_wins.map((win, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{win.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h6 className="font-semibold text-green-900 text-sm">{win.title}</h6>
                        {win.bangladesh_specific && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 border border-orange-300 text-orange-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            BD
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${DIFFICULTY_COLORS[win.difficulty]}`}>
                          {win.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 mb-1">{win.description}</p>
                      <p className="text-xs text-green-800 font-semibold">Save: {win.savings_kg} kg CO₂/month</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Savings Calculator */}
      {data.total_potential_savings_kg > 0 && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg text-purple-900">Savings Calculator</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <p className="text-purple-800 mb-2">
                <strong>If you follow these recommendations, you'll save:</strong>
              </p>
              <p className="text-3xl font-bold text-purple-900 mb-2">
                {data.total_potential_savings_kg} kg CO₂/month
              </p>
              <p className="text-sm text-purple-700">
                That's {Math.round(data.total_potential_savings_kg * 12)} kg CO₂ per year! 🌱
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

