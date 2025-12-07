import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  TreePine, 
  Users,
  Home,
  TrendingDown,
  Wind,
  UtensilsCrossed,
  Globe,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

interface Equivalents {
  car_km: number;
  trees_needed: number;
  bangladeshi_days: number;
  household_days: number;
  // Bangladesh-specific
  rickshaw_rides_km?: number;
  auto_rickshaw_km?: number;
  rice_kg?: number;
  fan_hours?: number;
  ac_hours?: number;
  global_days?: number;
  bangladeshi_average_monthly?: number;
}

interface ImpactStory {
  type: "current" | "reduction";
  carbon_kg: number;
  reduction_kg?: number;
  story: string;
  equivalents: Equivalents;
}

interface Comparison {
  your_monthly_kg: number;
  bangladeshi_avg_monthly: number;
  global_avg_monthly: number;
  vs_bangladeshi_percent: number;
  vs_global_percent: number;
  is_below_bangladeshi_avg: boolean;
  is_below_global_avg: boolean;
}

interface ImpactData {
  total_kg: number;
  period_days: number;
  equivalents: Equivalents;
  impact_story: ImpactStory;
  comparison?: Comparison;
}

interface ImpactVisualizationProps {
  data: ImpactData | null;
  loading?: boolean;
}

export default function ImpactVisualization({ 
  data, 
  loading = false 
}: ImpactVisualizationProps) {
  if (loading) {
    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin text-emerald-600">⏳</div>
            <p className="text-emerald-700 font-medium">Loading impact data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data && !loading) {
    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg">
        <CardContent className="p-6">
          <p className="text-emerald-700 font-medium">Start tracking your carbon footprint to see your impact equivalents!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Impact Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-emerald-900">Real-World Impact</CardTitle>
              <p className="text-sm text-emerald-700 mt-1">
                Your {data.total_kg} kg CO₂ equivalent to:
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Impact Story */}
          {data.impact_story && (
            <div className="p-4 bg-white/80 rounded-lg border border-emerald-200">
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-1" />
                <p className="text-emerald-800 font-medium">{data.impact_story.story}</p>
              </div>
            </div>
          )}

          {/* Comparison Section */}
          {data.comparison && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Your Footprint vs. Averages</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Your Monthly:</span>
                    <span className="font-bold text-blue-900">{data.comparison.your_monthly_kg.toFixed(1)} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Bangladeshi Average:</span>
                    <span className="font-semibold text-blue-800">{data.comparison.bangladeshi_avg_monthly} kg</span>
                  </div>
                  <div className={`p-2 rounded ${data.comparison.is_below_bangladeshi_avg ? 'bg-green-100' : 'bg-orange-100'}`}>
                    <p className={`text-sm font-semibold ${data.comparison.is_below_bangladeshi_avg ? 'text-green-800' : 'text-orange-800'}`}>
                      {data.comparison.is_below_bangladeshi_avg ? '✅' : '⚠️'} 
                      {data.comparison.vs_bangladeshi_percent.toFixed(0)}% of Bangladeshi average
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Global Average:</span>
                    <span className="font-semibold text-blue-800">{data.comparison.global_avg_monthly.toFixed(1)} kg</span>
                  </div>
                  <div className={`p-2 rounded ${data.comparison.is_below_global_avg ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className={`text-sm font-semibold ${data.comparison.is_below_global_avg ? 'text-green-800' : 'text-red-800'}`}>
                      {data.comparison.is_below_global_avg ? '✅' : '⚠️'} 
                      {data.comparison.vs_global_percent.toFixed(0)}% of global average
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Standard Equivalents */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              General Equivalents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Car Driving Equivalent */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900">Driving Distance</h4>
                </div>
                <p className="text-2xl font-bold text-emerald-900 mb-1">
                  {Math.round(data.equivalents.car_km)} km
                </p>
                <p className="text-sm text-emerald-700">
                  Equivalent to driving a car for {Math.round(data.equivalents.car_km)} kilometers
                </p>
              </motion.div>

              {/* Trees Needed */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900">Trees to Offset</h4>
                </div>
                <p className="text-2xl font-bold text-emerald-900 mb-1">
                  {Math.round(data.equivalents.trees_needed * 10) / 10} trees
                </p>
                <p className="text-sm text-emerald-700">
                  Mango trees needed to absorb this CO₂ in one year
                </p>
              </motion.div>

              {/* Bangladeshi Days */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900">Average Person Days</h4>
                </div>
                <p className="text-2xl font-bold text-emerald-900 mb-1">
                  {Math.round(data.equivalents.bangladeshi_days * 10) / 10} days
                </p>
                <p className="text-sm text-emerald-700">
                  Days of an average Bangladeshi person's emissions
                </p>
              </motion.div>

              {/* Household Days */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Home className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900">Household Days</h4>
                </div>
                <p className="text-2xl font-bold text-emerald-900 mb-1">
                  {Math.round(data.equivalents.household_days * 10) / 10} days
                </p>
                <p className="text-sm text-emerald-700">
                  Days of average household emissions
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bangladesh-Specific Equivalents */}
          {(data.equivalents.rickshaw_rides_km || data.equivalents.rice_kg || data.equivalents.fan_hours) && (
            <div>
              <h4 className="text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <span className="text-lg">🇧🇩</span>
                Bangladesh-Specific Equivalents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Rickshaw Rides */}
                {data.equivalents.rickshaw_rides_km && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-xl">🚲</span>
                      </div>
                      <h4 className="font-semibold text-emerald-900">Rickshaw Rides</h4>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900 mb-1">
                      {Math.round(data.equivalents.rickshaw_rides_km)} km
                    </p>
                    <p className="text-sm text-emerald-700">
                      Equivalent to {Math.round(data.equivalents.rickshaw_rides_km / 5)} cycle rickshaw rides (avg 5km each)
                    </p>
                  </motion.div>
                )}

                {/* Rice Production */}
                {data.equivalents.rice_kg && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg border-2 border-yellow-200 hover:border-yellow-400 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h4 className="font-semibold text-emerald-900">Rice Production</h4>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900 mb-1">
                      {Math.round(data.equivalents.rice_kg)} kg
                    </p>
                    <p className="text-sm text-emerald-700">
                      Equivalent to {Math.round(data.equivalents.rice_kg)} kg of rice production
                    </p>
                  </motion.div>
                )}

                {/* Fan Hours */}
                {data.equivalents.fan_hours && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                        <Wind className="w-5 h-5 text-cyan-600" />
                      </div>
                      <h4 className="font-semibold text-emerald-900">Fan Usage</h4>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900 mb-1">
                      {Math.round(data.equivalents.fan_hours)} hours
                    </p>
                    <p className="text-sm text-emerald-700">
                      Equivalent to {Math.round(data.equivalents.fan_hours / 24)} days of continuous fan usage
                    </p>
                  </motion.div>
                )}

                {/* AC Hours */}
                {data.equivalents.ac_hours && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Wind className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-emerald-900">AC Usage</h4>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900 mb-1">
                      {Math.round(data.equivalents.ac_hours)} hours
                    </p>
                    <p className="text-sm text-emerald-700">
                      Equivalent to {Math.round(data.equivalents.ac_hours / 24)} days of continuous AC usage
                    </p>
                  </motion.div>
                )}

                {/* Auto Rickshaw */}
                {data.equivalents.auto_rickshaw_km && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-xl">🛺</span>
                      </div>
                      <h4 className="font-semibold text-emerald-900">Auto Rickshaw</h4>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900 mb-1">
                      {Math.round(data.equivalents.auto_rickshaw_km)} km
                    </p>
                    <p className="text-sm text-emerald-700">
                      Equivalent to {Math.round(data.equivalents.auto_rickshaw_km / 10)} auto-rickshaw trips (avg 10km each)
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

