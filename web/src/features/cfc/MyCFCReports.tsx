import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, Package, Wrench, Plus, Calendar, Info, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface CFCReport {
  id: string;
  user_id: string;
  device: string;
  issue_type: string;
  notes: string | null;
  date: string;
  created_at: string;
}

export default function MyCFCReports() {
  const { data: reports, isLoading, error } = useQuery<CFCReport[]>({
    queryKey: ["cfc", "reports"],
    queryFn: async (): Promise<CFCReport[]> => {
      try {
        const response = await apiRequest("/api/v1/cfc/my-reports", "GET") as CFCReport[] | { success?: boolean; data?: CFCReport[] };
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as { data: CFCReport[] }).data || [];
        }
        return (response as CFCReport[]) || [];
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        return [];
      }
    },
  });

  const getIssueIcon = (issueType: string) => {
    switch (issueType) {
      case "Gas leak":
        return <AlertCircle className="w-6 h-6" />;
      case "Disposal":
        return <Trash2 className="w-6 h-6" />;
      case "Servicing":
        return <Wrench className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getIssueColor = (issueType: string) => {
    switch (issueType) {
      case "Gas leak":
        return "bg-red-500/10 border-red-400/20";
      case "Disposal":
        return "bg-orange-500/10 border-orange-400/20";
      case "Servicing":
        return "bg-blue-500/10 border-blue-400/20";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  const getIssueIconColor = (issueType: string) => {
    switch (issueType) {
      case "Gas leak":
        return "text-red-400";
      case "Disposal":
        return "text-orange-400";
      case "Servicing":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex flex-col pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My CFC Reports</h1>
              <p className="text-gray-300 text-lg">View and manage your CFC emission reports</p>
            </div>
            <Link to="/cfc/report">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </Link>
          </div>

          {isLoading && (
            <div className="glass-card rounded-2xl border border-white/10 shadow-lg">
              <div className="p-12 text-center">
                <div className="text-gray-400">Loading reports...</div>
              </div>
            </div>
          )}

          {error && (
            <div className="glass-card rounded-2xl border border-red-400/20 shadow-lg">
              <div className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <div className="text-red-300 font-semibold">Failed to load reports</div>
                <div className="text-gray-400 text-sm mt-2">Please try again later</div>
              </div>
            </div>
          )}

          {!isLoading && !error && (!reports || reports.length === 0) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card rounded-2xl border border-white/10 shadow-lg">
                <div className="p-12 text-center">
                  <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">No Reports Yet</h2>
                  <p className="text-gray-300 mb-6">
                    You haven't submitted any CFC reports yet. Start by reporting an issue.
                  </p>
                  <Link to="/cfc/report">
                    <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Report
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {!isLoading && !error && reports && reports.length > 0 && (
            <div className="space-y-4">
              <AnimatePresence>
                {reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`glass-card rounded-2xl border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ${getIssueColor(report.issue_type)}`}>
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl ${getIssueColor(report.issue_type)} flex items-center justify-center border border-white/10`}>
                            <div className={getIssueIconColor(report.issue_type)}>
                              {getIssueIcon(report.issue_type)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white">
                                {report.device}
                              </h3>
                              <span className="px-3 py-1 text-sm font-semibold bg-white/10 border border-white/20 rounded-full text-white">
                                {report.issue_type}
                              </span>
                            </div>
                            {report.notes && (
                              <p className="text-gray-300 mb-3 leading-relaxed">{report.notes}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                {report.date
                                  ? format(new Date(report.date), "MMM dd, yyyy 'at' h:mm a")
                                  : "Date not available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-card mt-8 rounded-2xl border border-white/10 shadow-lg bg-blue-500/10">
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-400 mb-2">Why Report CFC Issues?</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      Reporting CFC leaks and disposal issues helps us track environmental impact and
                      work towards better solutions. Your reports contribute to awareness and action
                      against harmful emissions.
                    </p>
                    <Link to="/cfc/learn" className="text-blue-400 hover:text-blue-300 text-sm font-semibold inline-flex items-center gap-1">
                      Learn more about CFCs
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
