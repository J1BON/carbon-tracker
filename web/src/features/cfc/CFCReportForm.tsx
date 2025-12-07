import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "@/lib/api.ts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  AlertCircle, 
  CheckCircle2, 
  Wind, 
  Refrigerator, 
  AlertTriangle, 
  Trash2, 
  Wrench,
  Snowflake,
  Droplets,
  Car,
  GlassWater,
  IceCream,
  Thermometer,
  Building2,
  Package,
  RotateCcw,
  RefreshCw,
  Settings,
  ArrowUpCircle,
  Recycle,
  Calculator
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CFCReportFormData {
  device: string;
  issue_type: string;
  notes: string;
}

// Device configurations with icons and descriptions
const DEVICE_CONFIG: Record<string, { icon: any; description: string; category: string }> = {
  "AC": { icon: Wind, description: "Air Conditioner", category: "Cooling" },
  "Refrigerator": { icon: Refrigerator, description: "Refrigerator", category: "Cooling" },
  "Freezer": { icon: Snowflake, description: "Standalone Freezer", category: "Cooling" },
  "Dehumidifier": { icon: Droplets, description: "Dehumidifier", category: "Climate Control" },
  "Car AC": { icon: Car, description: "Automotive Air Conditioning", category: "Automotive" },
  "Water Cooler": { icon: GlassWater, description: "Water Cooler/Dispenser", category: "Cooling" },
  "Ice Maker": { icon: IceCream, description: "Ice Maker Machine", category: "Cooling" },
  "Heat Pump": { icon: Thermometer, description: "Heat Pump System", category: "Climate Control" },
  "Chiller": { icon: Building2, description: "Commercial Chiller", category: "Commercial" },
  "Walk-in Cooler": { icon: Package, description: "Walk-in Refrigeration", category: "Commercial" },
  "Commercial Refrigeration": { icon: Building2, description: "Commercial Refrigeration", category: "Commercial" },
  "Window AC": { icon: Wind, description: "Window Air Conditioner", category: "Cooling" },
  "Split AC": { icon: Wind, description: "Split Air Conditioner", category: "Cooling" },
  "Central AC": { icon: Wind, description: "Central Air Conditioning", category: "Cooling" },
  "Car Refrigerator": { icon: Car, description: "Portable Car Refrigerator", category: "Automotive" },
};

// Issue type configurations
const ISSUE_TYPE_CONFIG: Record<string, { icon: any; description: string; color: string }> = {
  "Gas leak": { icon: AlertTriangle, description: "Refrigerant leak detected", color: "red" },
  "Disposal": { icon: Trash2, description: "Device disposal/replacement", color: "orange" },
  "Servicing": { icon: Wrench, description: "Maintenance/service required", color: "blue" },
  "Replacement": { icon: RefreshCw, description: "Replacing old CFC device", color: "purple" },
  "Improper disposal": { icon: AlertCircle, description: "Improper disposal concern", color: "red" },
  "Recycling": { icon: Recycle, description: "Recycling old device", color: "green" },
  "Maintenance check": { icon: Settings, description: "Routine maintenance check", color: "blue" },
  "Refrigerant recharge": { icon: RotateCcw, description: "Refrigerant recharge needed", color: "cyan" },
  "System upgrade": { icon: ArrowUpCircle, description: "Upgrading to CFC-free system", color: "emerald" },
};

export default function CFCReportForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CFCReportFormData>({
    device: "",
    issue_type: "",
    notes: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Fetch valid devices and issue types from API (optional - can use static list)
  const { data: validDevices } = useQuery<string[]>({
    queryKey: ["cfc", "devices"],
    queryFn: async () => {
      try {
        const response = await apiRequest("/api/v1/cfc/devices", "GET") as { success?: boolean; data?: string[] };
        return response?.data || Object.keys(DEVICE_CONFIG);
      } catch {
        return Object.keys(DEVICE_CONFIG);
      }
    },
  });

  const { data: validIssueTypes } = useQuery<string[]>({
    queryKey: ["cfc", "issue-types"],
    queryFn: async () => {
      try {
        const response = await apiRequest("/api/v1/cfc/issue-types", "GET") as { success?: boolean; data?: string[] };
        return response?.data || Object.keys(ISSUE_TYPE_CONFIG);
      } catch {
        return Object.keys(ISSUE_TYPE_CONFIG);
      }
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: CFCReportFormData) => {
      return await apiRequest("/api/v1/cfc/report", "POST", {
        device: data.device,
        issue_type: data.issue_type,
        notes: data.notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cfc", "reports"] });
      setSuccessMessage("Your CFC report has been submitted successfully!");
      setTimeout(() => {
        navigate("/cfc/my-reports");
      }, 1500);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.detail || "Failed to submit report. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    
    if (!formData.device || !formData.issue_type) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    createReportMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex flex-col pt-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Report CFC Issue</h1>
                <p className="text-gray-300 text-lg">
                  Help us track CFC emissions by reporting issues with CFC-containing devices in your daily life
                </p>
              </div>
              <Link to="/cfc/calculator">
                <Button variant="outline" className="border-emerald-400/20 text-emerald-300 hover:bg-emerald-500/10 rounded-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Impact
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 shadow-xl">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2">CFC Report Form</h2>
              <p className="text-gray-300 text-base">
                Please provide details about the CFC-related issue you've encountered
              </p>
            </div>
            <div className="p-6">
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-emerald-500/10 border-2 border-emerald-400/20 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-300 text-sm font-medium">{successMessage}</p>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border-2 border-red-400/20 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Device Selection */}
                <div className="space-y-2">
                  <Label htmlFor="device" className="text-base font-semibold text-gray-300">Device *</Label>
                  <p className="text-sm text-gray-400 mb-4">Select the CFC-containing device you want to report</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(validDevices || Object.keys(DEVICE_CONFIG)).map((device) => {
                      const config = DEVICE_CONFIG[device];
                      const IconComponent = config?.icon || Package;
                      const isSelected = formData.device === device;
                      
                      return (
                        <motion.div
                          key={device}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, device })}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                                : "border-white/10 hover:border-emerald-400/50 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? "bg-emerald-500 text-white" : "bg-white/5 text-gray-400 border border-white/10"
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className={`text-sm font-semibold text-center ${isSelected ? "text-white" : "text-gray-300"}`}>
                                {device}
                              </div>
                              {config && (
                                <div className={`text-xs text-center ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                                  {config.description}
                                </div>
                              )}
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Issue Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="issue_type" className="text-base font-semibold text-gray-300">Issue Type *</Label>
                  <p className="text-sm text-gray-400 mb-4">Select the type of issue or activity</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(validIssueTypes || Object.keys(ISSUE_TYPE_CONFIG)).map((issueType) => {
                      const config = ISSUE_TYPE_CONFIG[issueType];
                      const IconComponent = config?.icon || AlertCircle;
                      const isSelected = formData.issue_type === issueType;
                      const colorClasses = {
                        red: isSelected ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20" : "border-white/10 hover:border-red-400/50 bg-white/5 hover:bg-white/10",
                        orange: isSelected ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20" : "border-white/10 hover:border-orange-400/50 bg-white/5 hover:bg-white/10",
                        blue: isSelected ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20" : "border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-white/10",
                        purple: isSelected ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20" : "border-white/10 hover:border-purple-400/50 bg-white/5 hover:bg-white/10",
                        green: isSelected ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20" : "border-white/10 hover:border-green-400/50 bg-white/5 hover:bg-white/10",
                        cyan: isSelected ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20" : "border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-white/10",
                        emerald: isSelected ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20" : "border-white/10 hover:border-emerald-400/50 bg-white/5 hover:bg-white/10",
                      };
                      const iconColorClasses = {
                        red: isSelected ? "text-red-400" : "text-gray-400",
                        orange: isSelected ? "text-orange-400" : "text-gray-400",
                        blue: isSelected ? "text-blue-400" : "text-gray-400",
                        purple: isSelected ? "text-purple-400" : "text-gray-400",
                        green: isSelected ? "text-green-400" : "text-gray-400",
                        cyan: isSelected ? "text-cyan-400" : "text-gray-400",
                        emerald: isSelected ? "text-emerald-400" : "text-gray-400",
                      };
                      
                      return (
                        <motion.div
                          key={issueType}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, issue_type: issueType })}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              colorClasses[config?.color as keyof typeof colorClasses] || colorClasses.blue
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <IconComponent className={`w-5 h-5 ${
                                iconColorClasses[config?.color as keyof typeof iconColorClasses] || iconColorClasses.blue
                              }`} />
                              <div className={`text-sm font-semibold text-center ${isSelected ? "text-white" : "text-gray-300"}`}>
                                {issueType}
                              </div>
                              {config && (
                                <div className={`text-xs text-center ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                                  {config.description}
                                </div>
                              )}
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base font-semibold text-gray-300">Additional Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full min-h-[120px] rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="Provide any additional details about the issue..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={createReportMutation.isPending}
                    className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
                  >
                    {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/cfc/my-reports")}
                    className="h-12 px-6 border-white/20 hover:bg-white/5 text-gray-300 rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
