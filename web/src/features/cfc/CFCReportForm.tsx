import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, CheckCircle2, Wind, Refrigerator, AlertTriangle, Trash2, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CFCReportFormData {
  device: string;
  issue_type: string;
  notes: string;
}

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
            <h1 className="text-4xl font-bold text-white mb-2">Report CFC Issue</h1>
            <p className="text-gray-300 text-lg">
              Help us track CFC emissions by reporting issues with your AC or Refrigerator
            </p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, device: "AC" })}
                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                          formData.device === "AC"
                            ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                            : "border-white/10 hover:border-emerald-400/50 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            formData.device === "AC" ? "bg-emerald-500 text-white" : "bg-white/5 text-gray-400 border border-white/10"
                          }`}>
                            <Wind className="w-6 h-6" />
                          </div>
                          <div className={`text-lg font-semibold ${formData.device === "AC" ? "text-white" : "text-gray-300"}`}>AC</div>
                        </div>
                        <div className={`text-sm ${formData.device === "AC" ? "text-gray-300" : "text-gray-400"}`}>Air Conditioner</div>
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, device: "Refrigerator" })}
                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                          formData.device === "Refrigerator"
                            ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                            : "border-white/10 hover:border-emerald-400/50 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            formData.device === "Refrigerator" ? "bg-emerald-500 text-white" : "bg-white/5 text-gray-400 border border-white/10"
                          }`}>
                            <Refrigerator className="w-6 h-6" />
                          </div>
                          <div className={`text-lg font-semibold ${formData.device === "Refrigerator" ? "text-white" : "text-gray-300"}`}>Refrigerator</div>
                        </div>
                        <div className={`text-sm ${formData.device === "Refrigerator" ? "text-gray-300" : "text-gray-400"}`}>Refrigeration Unit</div>
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Issue Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="issue_type" className="text-base font-semibold text-gray-300">Issue Type *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, issue_type: "Gas leak" })}
                        className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                          formData.issue_type === "Gas leak"
                            ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
                            : "border-white/10 hover:border-red-400/50 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className={`w-5 h-5 ${formData.issue_type === "Gas leak" ? "text-red-400" : "text-gray-400"}`} />
                          <div className={`font-semibold ${formData.issue_type === "Gas leak" ? "text-white" : "text-gray-300"}`}>Gas leak</div>
                        </div>
                        <div className={`text-xs ${formData.issue_type === "Gas leak" ? "text-gray-300" : "text-gray-400"}`}>Refrigerant leak detected</div>
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, issue_type: "Disposal" })}
                        className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                          formData.issue_type === "Disposal"
                            ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20"
                            : "border-white/10 hover:border-orange-400/50 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Trash2 className={`w-5 h-5 ${formData.issue_type === "Disposal" ? "text-orange-400" : "text-gray-400"}`} />
                          <div className={`font-semibold ${formData.issue_type === "Disposal" ? "text-white" : "text-gray-300"}`}>Disposal</div>
                        </div>
                        <div className={`text-xs ${formData.issue_type === "Disposal" ? "text-gray-300" : "text-gray-400"}`}>Device disposal/replacement</div>
                      </button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, issue_type: "Servicing" })}
                        className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                          formData.issue_type === "Servicing"
                            ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                            : "border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className={`w-5 h-5 ${formData.issue_type === "Servicing" ? "text-blue-400" : "text-gray-400"}`} />
                          <div className={`font-semibold ${formData.issue_type === "Servicing" ? "text-white" : "text-gray-300"}`}>Servicing</div>
                        </div>
                        <div className={`text-xs ${formData.issue_type === "Servicing" ? "text-gray-300" : "text-gray-400"}`}>Maintenance/service required</div>
                      </button>
                    </motion.div>
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
