import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { apiRequest } from "@/lib/api";
import CarbonCalculator from "@/components/CarbonCalculator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatCarbonAmount } from "@/lib/utils";
import { exportActivityToPDF } from "@/lib/pdfExport";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  Zap,
  Award,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Car,
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  Package,
  BarChart3,
  LineChart,
  Activity,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#00BCD4", "#FF9800", "#9C27B0", "#F44336"];

interface CarbonLog {
  id: string;
  user_id: string;
  category: string;
  activity: string;
  carbon_amount_kg: number;
  metadata?: Record<string, any>;
  created_at: string;
}

interface CarbonStats {
  total_kg: number;
  daily_average_kg: number;
  monthly_kg: number;
  by_category: Record<string, number>;
}

const CATEGORY_CONFIG: Record<string, {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
}> = {
  transport: {
    icon: Car,
    label: "Transport",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  diet: {
    icon: UtensilsCrossed,
    label: "Diet",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
  energy: {
    icon: Zap,
    label: "Energy",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
  },
  shopping: {
    icon: ShoppingBag,
    label: "Shopping",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
  },
  lifestyle: {
    icon: Sparkles,
    label: "Lifestyle",
    color: "text-pink-600",
    bgColor: "bg-pink-50 border-pink-200",
  },
  other: {
    icon: Package,
    label: "Other",
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-200",
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="h-full"
    >
      <div className="h-full relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 opacity-90" />
        
        {/* Subtle gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center shadow-lg"
            >
              <Icon className="w-5 h-5 text-white" strokeWidth={2} />
            </motion.div>
            <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/5 text-gray-300 rounded-full border border-white/10 backdrop-blur-sm">
              {title}
            </span>
          </div>
          <h3 className="text-3xl font-semibold text-white mb-1 tracking-tight">
            {value}
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [activityPage, setActivityPage] = useState(1);
  const logsPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "carbon" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: stats, isLoading: statsLoading } = useQuery<CarbonStats>({
    queryKey: ["carbon", "stats"],
    queryFn: async (): Promise<CarbonStats> => {
      try {
        const response = await apiRequest("/api/v1/carbon/stats", "GET") as CarbonStats | { success?: boolean; data?: CarbonStats };
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as { data: CarbonStats }).data || {
            total_kg: 0,
            daily_average_kg: 0,
            monthly_kg: 0,
            by_category: {},
          };
        }
        return (response as CarbonStats) || {
          total_kg: 0,
          daily_average_kg: 0,
          monthly_kg: 0,
          by_category: {},
        };
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        return {
          total_kg: 0,
          daily_average_kg: 0,
          monthly_kg: 0,
          by_category: {},
        };
      }
    },
  });

  const { data: logsData } = useQuery<CarbonLog[]>({
    queryKey: ["carbon", "logs", activityPage],
    queryFn: async (): Promise<CarbonLog[]> => {
      try {
        const offset = (activityPage - 1) * logsPerPage;
        const response = await apiRequest(`/api/v1/carbon/logs?limit=${logsPerPage}&offset=${offset}`, "GET") as CarbonLog[] | { success?: boolean; data?: CarbonLog[] };
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as { data: CarbonLog[] }).data || [];
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        return [];
      }
    },
  });

  const logs: CarbonLog[] = Array.isArray(logsData) ? logsData : [];

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = [...logs];
    
    if (selectedCategory) {
      filtered = filtered.filter((log: any) => log.category === selectedCategory);
    }
    
    filtered.sort((a: any, b: any) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        // Sort by most recent first (descending by default)
        comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "carbon") {
        comparison = a.carbon_amount_kg - b.carbon_amount_kg;
      } else if (sortBy === "category") {
        comparison = (a.category || "").localeCompare(b.category || "");
      }
      
      return sortOrder === "asc" ? -comparison : comparison;
    });
    
    return filtered;
  }, [logs, selectedCategory, sortBy, sortOrder]);

  const groupedLogs = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredAndSortedLogs.forEach((log: any) => {
      const category = log.category || "other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(log);
    });
    return groups;
  }, [filteredAndSortedLogs]);

  const categoryData = stats
    ? Object.entries(stats.by_category || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: typeof value === 'number' ? value : parseFloat(String(value)),
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex flex-col pt-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12 flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dashboard Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Dashboard
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Track your carbon footprint and monitor your environmental impact
            </p>
          </motion.div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Footprint"
              value={statsLoading ? "..." : formatCarbonAmount(stats?.total_kg || 0)}
              subtitle="CO₂ equivalent"
              icon={TrendingUp}
              color="from-green-500 to-green-600"
              delay={0}
            />
            <StatCard
              title="Monthly Total"
              value={statsLoading ? "..." : formatCarbonAmount(stats?.monthly_kg || 0)}
              subtitle="This month"
              icon={Calendar}
              color="from-blue-500 to-blue-600"
              delay={0.1}
            />
            <StatCard
              title="Daily Average"
              value={statsLoading ? "..." : formatCarbonAmount(stats?.daily_average_kg || 0)}
              subtitle="Last 30 days"
              icon={Zap}
              color="from-yellow-500 to-orange-600"
              delay={0.2}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="h-full"
            >
              <div className="h-full relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 opacity-90" />
                
                {/* Subtle gradient background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center shadow-lg"
                    >
                      <Award className="w-5 h-5 text-white" strokeWidth={2} />
                    </motion.div>
                    <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/5 text-gray-300 rounded-full border border-white/10 backdrop-blur-sm">
                      Eco Score
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <h3 className="text-3xl font-semibold text-white tracking-tight">
                      {user?.eco_score || 0}
                    </h3>
                    <span className="text-lg font-medium text-gray-400">/100</span>
                  </div>
                  
                  {/* Enhanced gradient progress bar */}
                  <div className="mt-4">
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((user?.eco_score || 0), 100)}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg"
                      />
                      {/* Animated shimmer effect */}
                      <motion.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-400 mt-2 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${user?.eco_score && user.eco_score > 80 ? "bg-emerald-400" : user?.eco_score && user.eco_score > 60 ? "bg-yellow-400" : "bg-gray-400"}`} />
                      {user?.eco_score && user.eco_score > 80 ? "Excellent" : user?.eco_score && user.eco_score > 60 ? "Good" : "Improving"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50 pointer-events-none rounded-2xl" />
                
                <div className="pb-4 p-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                        Carbon by Category
                      </h3>
                      <p className="text-sm text-gray-400 font-medium">
                        Breakdown of your emissions
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                </div>
                <div className="pb-8 px-6 relative z-10">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth={2}
                          animationDuration={1000}
                          animationBegin={0}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.95)', 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            padding: '12px',
                            color: '#ffffff'
                          }} 
                          itemStyle={{ color: '#ffffff' }}
                          labelStyle={{ color: '#ffffff' }}
                          formatter={(value: any, name: any) => {
                            return [formatCarbonAmount(value), name];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[320px] flex flex-col items-center justify-center text-gray-400">
                      <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-sm font-semibold text-gray-400">No data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-50 pointer-events-none rounded-2xl" />
                
                <div className="pb-4 p-6 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                        Category Comparison
                      </h3>
                      <p className="text-sm text-gray-400 font-medium">
                        Visual comparison of emissions
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
                      <LineChart className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>
                <div className="pb-8 px-6 relative z-10">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" strokeOpacity={0.3} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9ca3af" 
                          fontSize={11} 
                          tickLine={false} 
                          tick={{ fill: '#9ca3af' }} 
                        />
                        <YAxis 
                          stroke="#9ca3af" 
                          fontSize={11} 
                          tickLine={false} 
                          tick={{ fill: '#9ca3af' }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.95)', 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            borderRadius: '12px',
                            backdropFilter: 'blur(20px)',
                            padding: '12px',
                            color: '#ffffff'
                          }} 
                          itemStyle={{ color: '#ffffff' }}
                          labelStyle={{ color: '#ffffff' }}
                          formatter={(value: any, name: any) => {
                            return [formatCarbonAmount(value), name];
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1000} animationBegin={0}>
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[320px] flex flex-col items-center justify-center text-gray-400">
                      <LineChart className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-sm font-semibold text-gray-400">No data available yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Carbon Calculator */}
          <div className="mb-6">
            <CarbonCalculator />
          </div>

          {/* Activity Logs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="glass-card rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="pb-4 p-6 border-b border-white/10">
                <div className="flex flex-row items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Activity Logs
                      </h2>
                      <p className="text-sm text-gray-400 font-medium mt-1">
                        {filteredAndSortedLogs.length} {filteredAndSortedLogs.length === 1 ? "activity" : "activities"}
                        {selectedCategory && ` in ${CATEGORY_CONFIG[selectedCategory]?.label || selectedCategory}`}
                      </p>
                    </div>
                  </div>
                  {logs && logs.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const allLogsResponse = await apiRequest("/api/v1/carbon/logs?limit=1000&offset=0", "GET") as CarbonLog[] | { success?: boolean; data?: CarbonLog[] };
                          let allLogs: CarbonLog[] = [];
                          if (allLogsResponse && typeof allLogsResponse === 'object' && 'data' in allLogsResponse) {
                            allLogs = (allLogsResponse as { data: CarbonLog[] }).data || [];
                          } else if (Array.isArray(allLogsResponse)) {
                            allLogs = allLogsResponse;
                          }
                          await exportActivityToPDF(allLogs, stats || null, user?.name);
                        } catch (error) {
                          console.error("Failed to export PDF:", error);
                        }
                      }}
                      className="flex items-center gap-2 border-white/20 hover:bg-white/5 text-gray-300"
                    >
                      <Download className="w-4 h-4" />
                      Export PDF
                    </Button>
                  )}
                </div>

                {/* Filters */}
                {logs && logs.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 pt-4 px-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-300 tracking-wide">Category:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                            selectedCategory === null
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25"
                              : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                          }`}
                        >
                          All
                        </button>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                          const IconComponent = config.icon;
                          return (
                            <button
                              key={key}
                              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                selectedCategory === key
                                  ? "bg-white/10 text-white border-2 border-white/20 shadow-md"
                                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                              }`}
                            >
                              <IconComponent className="w-4 h-4" />
                              {config.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs font-semibold text-gray-300 tracking-wide">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-1.5 text-xs border border-white/10 rounded-xl bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 font-medium"
                        style={{ backgroundColor: '#000000' }}
                      >
                        <option value="date" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Date</option>
                        <option value="carbon" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Carbon Amount</option>
                        <option value="category" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Category</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="h-8 w-8 p-0 rounded-xl border-white/20 hover:bg-white/5 text-gray-300"
                      >
                        {sortOrder === "asc" ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                {filteredAndSortedLogs.length > 0 ? (
                  <div className="overflow-y-auto max-h-[600px] pr-2 space-y-6">
                    <AnimatePresence>
                      {Object.entries(groupedLogs)
                        .sort((a, b) => {
                          const totalA = a[1].reduce((sum, log) => sum + log.carbon_amount_kg, 0);
                          const totalB = b[1].reduce((sum, log) => sum + log.carbon_amount_kg, 0);
                          return totalB - totalA;
                        })
                        .map(([category, categoryLogs], categoryIndex) => {
                          const categoryInfo = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
                          const categoryTotal = categoryLogs.reduce((sum, log) => sum + log.carbon_amount_kg, 0);
                          const IconComponent = categoryInfo.icon;

                          return (
                            <motion.div
                              key={category}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: categoryIndex * 0.1 }}
                            >
                              <div className="p-4 rounded-2xl glass-card border border-white/10 hover:border-white/20 transition-all duration-300 mb-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center shadow-lg">
                                      <IconComponent className="w-7 h-7 text-emerald-400" strokeWidth={2.5} />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-base text-white tracking-tight">
                                        {categoryInfo.label}
                                      </h3>
                                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                                        {categoryLogs.length} {categoryLogs.length === 1 ? "activity" : "activities"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg text-emerald-400 tracking-tight">
                                      {formatCarbonAmount(categoryTotal)}
                                    </p>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">Total CO₂</p>
                                  </div>
                                </div>
                                <div className="border-t border-white/10 my-4" />
                                <div className="space-y-0 border border-white/10 rounded-xl overflow-hidden bg-white/5">
                                  {categoryLogs.map((log: any) => (
                                    <div
                                      key={log.id}
                                      className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors duration-200 border-b border-white/10 last:border-b-0"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-white tracking-tight mb-1">
                                          {log.activity}
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium">
                                          {new Date(log.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                      </div>
                                      <div className="text-right ml-4">
                                        <p className="font-bold text-white text-sm tracking-tight">
                                          {formatCarbonAmount(log.carbon_amount_kg)}
                                        </p>
                                        <p className="text-xs text-emerald-400 font-medium mt-0.5">CO₂</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Activity className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-300 text-sm font-semibold mb-1">No activity yet</p>
                    <p className="text-gray-500 text-xs font-medium">Start tracking your carbon footprint</p>
                  </div>
                )}

                {/* Pagination */}
                {(activityPage > 1 || logs.length === logsPerPage) && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                      disabled={activityPage === 1}
                      className="rounded-xl border-white/20 hover:bg-white/5 text-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-xs text-gray-400 font-semibold tracking-wide">Page {activityPage}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivityPage((p) => p + 1)}
                      disabled={logs.length < logsPerPage}
                      className="rounded-xl border-white/20 hover:bg-white/5 text-gray-300"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
