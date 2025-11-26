import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Leaf, 
  TrendingDown, 
  Lightbulb, 
  Award
} from "lucide-react";

interface Suggestion {
  action: string;
  description: string;
  impact: "low" | "medium" | "high";
  icon: string;
  points: number;
}

interface CategoryAnalysis {
  category: string;
  total_kg: number;
  average_per_entry: number;
  entry_count: number;
  percentage_of_total: number;
}

interface SuggestionData {
  title: string;
  description: string;
  suggestions: Suggestion[];
  category_analysis?: CategoryAnalysis;
  encouragement?: string;
  daily_tip?: string;
}

interface CarbonSuggestionsProps {
  suggestions: SuggestionData | null;
  dailyTip?: string;
  loading?: boolean;
}

const IMPACT_COLORS = {
  high: "bg-red-100 border-red-300 text-red-800",
  medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
  low: "bg-green-100 border-green-300 text-green-800",
};

const IMPACT_LABELS = {
  high: "High Impact",
  medium: "Medium Impact",
  low: "Low Impact",
};

export default function CarbonSuggestions({ 
  suggestions, 
  dailyTip,
  loading = false 
}: CarbonSuggestionsProps) {
  if (loading) {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin text-green-600">⏳</div>
            <p className="text-green-700 font-medium">Loading suggestions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Suggestions Card */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-green-900">{suggestions.title}</CardTitle>
              <p className="text-sm text-green-700 mt-1">{suggestions.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Encouragement Message */}
          {suggestions.encouragement && (
            <div className="p-4 bg-white/80 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">{suggestions.encouragement}</p>
            </div>
          )}

          {/* Category Analysis */}
          {suggestions.category_analysis && (
            <div className="p-4 bg-white/80 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-green-700" />
                <h4 className="font-semibold text-green-900">Category Analysis</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-green-600 font-medium">Total Emissions:</span>
                  <span className="ml-2 text-green-800">{suggestions.category_analysis.total_kg} kg CO₂</span>
                </div>
                <div>
                  <span className="text-green-600 font-medium">% of Total:</span>
                  <span className="ml-2 text-green-800">{suggestions.category_analysis.percentage_of_total}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-green-900 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Personalized Recommendations
            </h4>
            {suggestions.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{suggestion.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-bold text-green-900 text-base">{suggestion.action}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${IMPACT_COLORS[suggestion.impact]}`}>
                        {IMPACT_LABELS[suggestion.impact]}
                      </span>
                      {suggestion.points > 0 && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Award className="w-4 h-4" />
                          <span className="text-xs font-semibold">+{suggestion.points} pts</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-green-700">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Green Tip */}
      {(suggestions.daily_tip || dailyTip) && (
        <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg text-teal-900">Daily Green Tip</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-teal-800 font-medium">{suggestions.daily_tip || dailyTip}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

