import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, api } from "@/lib/api.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Calculator, 
  Wind, 
  Refrigerator, 
  Snowflake, 
  Droplets, 
  Car, 
  GlassWater, 
  IceCream, 
  Thermometer, 
  Building2,
  AlertTriangle,
  Trash2,
  Wrench,
  RefreshCw,
  Recycle,
  RotateCcw,
  ArrowUpCircle,
  Settings,
  AlertCircle,
  TrendingUp,
  TreePine,
  Car as CarIcon,
  Users,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface CFCCalculationResult {
  device: string;
  issue_type: string;
  refrigerant_type: string;
  refrigerant_amount_kg: number;
  cfc_released_kg: number;
  gwp: number;
  co2_equivalent_kg: number;
  ozone_depletion: number;
  device_age_years: number | null;
  age_factor: number;
  equivalents: {
    car_km: number;
    trees_needed: number;
    person_days: number;
  };
  impact_level: string;
}

interface DeviceConfig {
  icon: any;
  description: string;
  category: string;
}

const DEVICE_CONFIG: Record<string, DeviceConfig> = {
  "AC": { icon: Wind, description: "Air Conditioner", category: "Home" },
  "Refrigerator": { icon: Refrigerator, description: "Refrigerator", category: "Home" },
  "Freezer": { icon: Snowflake, description: "Standalone Freezer", category: "Home" },
  "Dehumidifier": { icon: Droplets, description: "Dehumidifier", category: "Home" },
  "Water Cooler": { icon: GlassWater, description: "Water Cooler", category: "Home" },
  "Ice Maker": { icon: IceCream, description: "Ice Maker", category: "Home" },
  "Heat Pump": { icon: Thermometer, description: "Heat Pump", category: "Home" },
  "Window AC": { icon: Wind, description: "Window AC", category: "Home" },
  "Split AC": { icon: Wind, description: "Split AC", category: "Home" },
  "Central AC": { icon: Wind, description: "Central AC", category: "Home" },
  "Car AC": { icon: Car, description: "Automotive AC", category: "Automotive" },
  "Car Refrigerator": { icon: Car, description: "Car Refrigerator", category: "Automotive" },
  "Chiller": { icon: Building2, description: "Commercial Chiller", category: "Commercial" },
  "Walk-in Cooler": { icon: Building2, description: "Walk-in Cooler", category: "Commercial" },
  "Commercial Refrigeration": { icon: Building2, description: "Commercial Refrigeration", category: "Commercial" },
};

// Static fallback device list
const STATIC_DEVICES = Object.keys(DEVICE_CONFIG);

// Device size presets for user-friendly selection
const DEVICE_SIZE_PRESETS: Record<string, { label: string; amount: number; description: string }[]> = {
  "AC": [
    { label: "Small (1 ton)", amount: 1.0, description: "Small room AC" },
    { label: "Medium (1.5 ton)", amount: 1.5, description: "Average home AC" },
    { label: "Large (2+ ton)", amount: 2.5, description: "Large home/office AC" },
  ],
  "Window AC": [
    { label: "Small", amount: 0.8, description: "Small window unit" },
    { label: "Medium", amount: 1.0, description: "Standard window unit" },
    { label: "Large", amount: 1.5, description: "Large window unit" },
  ],
  "Split AC": [
    { label: "Small (1 ton)", amount: 1.2, description: "Small split system" },
    { label: "Medium (1.5 ton)", amount: 1.5, description: "Standard split system" },
    { label: "Large (2+ ton)", amount: 2.0, description: "Large split system" },
  ],
  "Central AC": [
    { label: "Small (2-3 ton)", amount: 2.5, description: "Small central system" },
    { label: "Medium (3-5 ton)", amount: 3.0, description: "Standard central system" },
    { label: "Large (5+ ton)", amount: 4.5, description: "Large central system" },
  ],
  "Refrigerator": [
    { label: "Small", amount: 0.15, description: "Mini/compact fridge" },
    { label: "Medium", amount: 0.2, description: "Standard home fridge" },
    { label: "Large", amount: 0.3, description: "Large/family fridge" },
  ],
  "Freezer": [
    { label: "Small", amount: 0.2, description: "Compact freezer" },
    { label: "Medium", amount: 0.3, description: "Standard freezer" },
    { label: "Large", amount: 0.5, description: "Large chest freezer" },
  ],
  "Car AC": [
    { label: "Small car", amount: 0.5, description: "Compact car" },
    { label: "Medium car", amount: 0.6, description: "Standard car" },
    { label: "Large car/SUV", amount: 0.8, description: "Large vehicle" },
  ],
};

const ISSUE_TYPE_CONFIG: Record<string, { icon: any; color: string; description: string }> = {
  "Gas leak": { icon: AlertTriangle, color: "red", description: "Refrigerant leak detected" },
  "Disposal": { icon: Trash2, color: "orange", description: "Device disposal" },
  "Servicing": { icon: Wrench, color: "blue", description: "Maintenance/service" },
  "Replacement": { icon: RefreshCw, color: "purple", description: "Replacing device" },
  "Improper disposal": { icon: AlertCircle, color: "red", description: "Improper disposal" },
  "Recycling": { icon: Recycle, color: "green", description: "Recycling device" },
  "Maintenance check": { icon: Settings, color: "blue", description: "Routine check" },
  "Refrigerant recharge": { icon: RotateCcw, color: "cyan", description: "Refrigerant recharge" },
  "System upgrade": { icon: ArrowUpCircle, color: "emerald", description: "System upgrade" },
};

export default function CFCCalculator() {
  const [device, setDevice] = useState<string>("");
  const [issueType, setIssueType] = useState<string>("");
  const [refrigerantType, setRefrigerantType] = useState<string>("Unknown");
  const [refrigerantAmount, setRefrigerantAmount] = useState<string>("");
  const [deviceAge, setDeviceAge] = useState<string>("");
  const [result, setResult] = useState<CFCCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch valid devices and issue types with fallback
  const { data: validDevices } = useQuery<string[]>({
    queryKey: ["cfc", "devices"],
    queryFn: async () => {
      try {
        const response = await apiRequest("/api/v1/cfc/devices", "GET") as { success?: boolean; data?: string[] };
        return response?.data || STATIC_DEVICES;
      } catch {
        return STATIC_DEVICES;
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

  // Static fallback refrigerant types
  const STATIC_REFRIGERANT_TYPES = [
    "CFC-12",
    "CFC-11",
    "HCFC-22",
    "HCFC-141b",
    "HFC-134a",
    "R-410A",
    "R-404A",
    "Unknown",
  ];

  const { data: refrigerantTypes } = useQuery<string[]>({
    queryKey: ["cfc", "refrigerant-types"],
    queryFn: async () => {
      try {
        const response = await apiRequest("/api/v1/cfc/refrigerant-types", "GET") as { success?: boolean; data?: string[] };
        return response?.data || STATIC_REFRIGERANT_TYPES;
      } catch {
        return STATIC_REFRIGERANT_TYPES;
      }
    },
  });

  // Fetch device defaults when device changes
  const { data: deviceDefaults } = useQuery({
    queryKey: ["cfc", "device-defaults", device],
    queryFn: async () => {
      if (!device) return null;
      const response = await apiRequest(`/api/v1/cfc/device-defaults/${device}`, "GET") as { success?: boolean; data?: any };
      return response?.data;
    },
    enabled: !!device,
  });

  // Set default refrigerant amount when device changes
  useEffect(() => {
    if (!device) {
      setRefrigerantAmount("");
      return;
    }
    
    if (deviceDefaults) {
      const defaultAmount = deviceDefaults.refrigerant_amount_kg?.toString() || "";
      // Auto-fill when device changes (user can override if needed)
      setRefrigerantAmount(defaultAmount);
      if (deviceDefaults.typical_refrigerant) {
        setRefrigerantType(deviceDefaults.typical_refrigerant);
      }
    }
  }, [device, deviceDefaults]);

  const handleCalculate = async () => {
    setError(null);
    setResult(null);

    if (!device || !issueType) {
      setError("Please select a device and issue type");
      return;
    }

    setLoading(true);

    try {
      // Parse values safely, converting empty strings to null
      let parsedRefrigerantAmount: number | null = null;
      if (refrigerantAmount && refrigerantAmount.trim() !== "") {
        const parsed = parseFloat(refrigerantAmount);
        if (!isNaN(parsed) && parsed > 0) {
          parsedRefrigerantAmount = parsed;
        }
      }

      let parsedDeviceAge: number | null = null;
      if (deviceAge && deviceAge.trim() !== "") {
        const parsed = parseInt(deviceAge);
        if (!isNaN(parsed) && parsed >= 0) {
          parsedDeviceAge = parsed;
        }
      }

      // Use direct API call instead of apiRequest to get better error handling
      const response = await api.post("/api/v1/cfc/calculate", {
        device,
        issue_type: issueType,
        refrigerant_type: refrigerantType || "Unknown",
        refrigerant_amount_kg: parsedRefrigerantAmount,
        device_age_years: parsedDeviceAge,
      });

      // Check if response has success and data
      if (response.data?.success && response.data?.data) {
        setResult(response.data.data);
      } else if (response.data?.success === false) {
        setError(response.data.detail || response.data.message || "Failed to calculate CFC impact");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      console.error("CFC Calculation Error:", err);
      // Try to extract error message from various possible locations
      const errorMessage = 
        err?.response?.data?.detail || 
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to calculate. Please check your inputs and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case "Extreme":
        return "text-red-400 bg-red-500/10 border-red-400/20";
      case "Very High":
        return "text-orange-400 bg-orange-500/10 border-orange-400/20";
      case "High":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-400/20";
      case "Medium":
        return "text-blue-400 bg-blue-500/10 border-blue-400/20";
      case "Low":
        return "text-green-400 bg-green-500/10 border-green-400/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-400/20";
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
          className="space-y-6"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">CFC Impact Calculator</h1>
            <p className="text-gray-300 text-lg">
              Calculate the environmental impact of CFC emissions from your devices
            </p>
          </div>
          
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="space-y-6">
          {/* Device Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold text-gray-300">Select Your Device *</Label>
              <p className="text-sm text-gray-400 mt-1">Choose the device that contains or may contain CFCs</p>
            </div>
            
            {/* Organize devices by category */}
            {(() => {
              const devices = validDevices || STATIC_DEVICES;
              const categories = ["Home", "Automotive", "Commercial"] as const;
              
              return categories.map((category) => {
                const categoryDevices = devices.filter(dev => DEVICE_CONFIG[dev]?.category === category);
                if (categoryDevices.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <div className="h-px flex-1 bg-white/10"></div>
                      {category}
                      <div className="h-px flex-1 bg-white/10"></div>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {categoryDevices.map((dev) => {
                        const config = DEVICE_CONFIG[dev];
                        const IconComponent = config?.icon || Building2;
                        const isSelected = device === dev;
                        
                        return (
                          <motion.button
                            key={dev}
                            type="button"
                            onClick={() => setDevice(dev)}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/20"
                                : "border-white/10 hover:border-emerald-400/50 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected 
                                  ? "bg-emerald-500/20 text-emerald-400" 
                                  : "bg-white/5 text-gray-400"
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="text-center">
                                <span className={`text-sm font-semibold block ${isSelected ? "text-white" : "text-gray-300"}`}>
                                  {dev}
                                </span>
                                {config?.description && (
                                  <span className={`text-xs mt-0.5 block ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                                    {config.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
            
            {/* Show selected device info */}
            {device && DEVICE_CONFIG[device] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-400/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = DEVICE_CONFIG[device].icon;
                    return <IconComponent className="w-5 h-5 text-emerald-400" />;
                  })()}
                  <div>
                    <p className="text-sm font-semibold text-white">{device} Selected</p>
                    <p className="text-xs text-gray-300">{DEVICE_CONFIG[device].description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Issue Type Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold text-gray-300">What's the Issue? *</Label>
              <p className="text-sm text-gray-400 mt-1">Select the type of issue or activity related to your device</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {(validIssueTypes || Object.keys(ISSUE_TYPE_CONFIG)).map((issue) => {
                const config = ISSUE_TYPE_CONFIG[issue];
                const IconComponent = config?.icon || AlertCircle;
                const isSelected = issueType === issue;
                
                // Color classes mapping
                const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
                  red: {
                    border: isSelected ? "border-red-500 bg-red-500/10" : "border-white/10 hover:border-red-400/50 bg-white/5",
                    bg: "",
                    text: isSelected ? "text-red-400" : "text-gray-400",
                  },
                  orange: {
                    border: isSelected ? "border-orange-500 bg-orange-500/10" : "border-white/10 hover:border-orange-400/50 bg-white/5",
                    bg: "",
                    text: isSelected ? "text-orange-400" : "text-gray-400",
                  },
                  blue: {
                    border: isSelected ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-blue-400/50 bg-white/5",
                    bg: "",
                    text: isSelected ? "text-blue-400" : "text-gray-400",
                  },
                  purple: {
                    border: isSelected ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-purple-400/50 bg-white/5",
                    bg: "",
                    text: isSelected ? "text-purple-400" : "text-gray-400",
                  },
                  green: {
                    border: isSelected ? "border-green-500 bg-green-500/10" : "border-white/10 hover:border-green-400/50 bg-white/5",
                    bg: "",
                    text: isSelected ? "text-green-400" : "text-gray-400",
                  },
                  cyan: {
                    border: isSelected ? "border-cyan-500 bg-cyan-500/10" : "border-white/10 hover:border-cyan-400/50 bg-white/5",
                    bg: "",
                    text: isSelected ? "text-cyan-400" : "text-gray-400",
                  },
                  emerald: {
                    border: isSelected ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 hover:border-emerald-400/50 bg-white/5",
                    bg: "",
                    text: isSelected ? "text-emerald-400" : "text-gray-400",
                  },
                };
                
                const colors = colorClasses[config?.color || "blue"];
                
                return (
                  <motion.button
                    key={issue}
                    type="button"
                    onClick={() => setIssueType(issue)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${colors.border}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-white/10" : "bg-white/5"
                      }`}>
                        <IconComponent className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="text-center">
                        <span className={`text-sm font-semibold block ${isSelected ? "text-white" : "text-gray-300"}`}>
                          {issue}
                        </span>
                        {config?.description && (
                          <span className={`text-xs mt-0.5 block ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                            {config.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Show selected issue type info */}
            {issueType && ISSUE_TYPE_CONFIG[issueType] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = ISSUE_TYPE_CONFIG[issueType].icon;
                    return <IconComponent className="w-5 h-5 text-blue-400" />;
                  })()}
                  <div>
                    <p className="text-sm font-semibold text-white">{issueType} Selected</p>
                    <p className="text-xs text-gray-300">{ISSUE_TYPE_CONFIG[issueType].description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Refrigerant Type Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold text-gray-300">
                Refrigerant Type
              </Label>
              <p className="text-sm text-gray-400 mt-1">
                Select the type of refrigerant (if known). Most older devices use CFC-12 or HCFC-22.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(refrigerantTypes || STATIC_REFRIGERANT_TYPES).map((type) => {
                const isSelected = refrigerantType === type;
                const isCFC = type.startsWith("CFC");
                const isHCFC = type.startsWith("HCFC");
                const isHFC = type.startsWith("HFC") || type.startsWith("R-");
                
                // Color coding based on refrigerant type
                let borderColor = "border-white/10";
                let bgColor = "bg-white/5";
                let textColor = "text-gray-400";
                
                if (isSelected) {
                  if (isCFC) {
                    borderColor = "border-red-500 bg-red-500/20 shadow-lg shadow-red-500/20";
                    textColor = "text-red-400";
                  } else if (isHCFC) {
                    borderColor = "border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20";
                    textColor = "text-orange-400";
                  } else if (isHFC || type === "Unknown") {
                    borderColor = "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20";
                    textColor = "text-blue-400";
                  }
                } else {
                  if (isCFC) {
                    borderColor = "border-white/10 hover:border-red-400/50 bg-white/5 hover:bg-white/10";
                  } else if (isHCFC) {
                    borderColor = "border-white/10 hover:border-orange-400/50 bg-white/5 hover:bg-white/10";
                  } else {
                    borderColor = "border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-white/10";
                  }
                }
                
                return (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => setRefrigerantType(type)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${borderColor}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-300"}`}>
                        {type}
                      </span>
                      {type !== "Unknown" && (
                        <span className={`text-xs ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                          {isCFC ? "Ozone Depleting" : isHCFC ? "Being Phased Out" : "CFC Alternative"}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Show selected refrigerant info */}
            {refrigerantType && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">{refrigerantType} Selected</p>
                    <p className="text-xs text-gray-300">
                      {refrigerantType === "Unknown" 
                        ? "Using average estimate for unknown refrigerant type"
                        : "This refrigerant type will be used for impact calculation"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="space-y-6">
            {/* Refrigerant Amount Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="refrigerant-amount" className="text-base font-semibold text-gray-300">
                  Refrigerant Amount (Optional)
                </Label>
                <p className="text-sm text-gray-400 mt-1">
                  {device 
                    ? `Auto-filled with typical amount for ${device}. Only change if you know the exact amount.`
                    : "This will be auto-filled when you select a device. Most people don't need to change this."}
                </p>
              </div>

              {/* Show size presets for devices that have them */}
              {device && DEVICE_SIZE_PRESETS[device] && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-medium">Quick Select by Size:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {DEVICE_SIZE_PRESETS[device].map((preset) => {
                      const isSelected = refrigerantAmount === preset.amount.toString();
                      return (
                        <motion.button
                          key={preset.label}
                          type="button"
                          onClick={() => setRefrigerantAmount(preset.amount.toString())}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/20 text-white"
                              : "border-white/10 hover:border-emerald-400/50 bg-white/5 text-gray-300"
                          }`}
                        >
                          <div className="text-xs font-semibold">{preset.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{preset.amount} kg</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Manual input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="refrigerant-amount" className="text-sm font-medium text-gray-400">
                    Or enter amount manually (kg):
                  </Label>
                  {deviceDefaults && (
                    <button
                      type="button"
                      onClick={() => setRefrigerantAmount(deviceDefaults.refrigerant_amount_kg?.toString() || "")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Reset to default ({deviceDefaults.refrigerant_amount_kg} kg)
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="refrigerant-amount"
                    type="number"
                    step="0.1"
                    min="0"
                    value={refrigerantAmount}
                    onChange={(e) => setRefrigerantAmount(e.target.value)}
                    placeholder={deviceDefaults?.refrigerant_amount_kg?.toString() || "Auto-filled"}
                    className="bg-white/5 border-white/20 text-white pr-20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    kg
                  </div>
                </div>
                {deviceDefaults && (
                  <p className="text-xs text-gray-500">
                    💡 Typical amount: <span className="text-gray-400 font-medium">{deviceDefaults.refrigerant_amount_kg} kg</span> for {device}
                  </p>
                )}
              </div>
            </div>

            {/* Device Age Section */}
            <div className="space-y-2">
              <Label htmlFor="device-age" className="text-base font-semibold text-gray-300">
                Device Age (Optional)
              </Label>
              <p className="text-sm text-gray-400 mt-1">
                How old is your device? Older devices are more likely to contain CFCs.
              </p>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[
                  { label: "New (0-5)", value: "3" },
                  { label: "Medium (5-10)", value: "7" },
                  { label: "Old (10-15)", value: "12" },
                  { label: "Very Old (15+)", value: "20" },
                ].map((age) => {
                  const isSelected = deviceAge === age.value;
                  return (
                    <motion.button
                      key={age.label}
                      type="button"
                      onClick={() => setDeviceAge(age.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/20 text-white"
                          : "border-white/10 hover:border-blue-400/50 bg-white/5 text-gray-300"
                      }`}
                    >
                      <div className="text-xs font-semibold">{age.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{age.value} years</div>
                    </motion.button>
                  );
                })}
              </div>
              <div className="relative mt-2">
                <Input
                  id="device-age"
                  type="number"
                  min="0"
                  value={deviceAge}
                  onChange={(e) => setDeviceAge(e.target.value)}
                  placeholder="Or enter exact age"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={loading || !device || !issueType}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-semibold disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate CFC Impact"}
          </Button>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-400/20 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-300 mb-1">Calculation Error</p>
                  <p className="text-sm text-red-300">{error}</p>
                  {(error.includes("401") || error.includes("Unauthorized") || error.includes("authentication")) && (
                    <p className="text-xs text-red-400 mt-2">
                      💡 Please make sure you're logged in to use the calculator.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className={`p-6 rounded-xl border-2 ${getImpactColor(result.impact_level)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Impact Level: {result.impact_level}</h3>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">CO₂ Equivalent</p>
                      <p className="text-3xl font-bold text-white">
                        {result.co2_equivalent_kg.toLocaleString()} kg
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">CFC Released</p>
                      <p className="text-3xl font-bold text-white">
                        {result.cfc_released_kg.toFixed(3)} kg
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-400 mb-2">Ozone Depletion Potential</p>
                    <p className="text-2xl font-bold text-white">
                      {result.ozone_depletion.toFixed(3)} ODP
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm font-semibold text-gray-300 mb-3">Impact Equivalents:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                        <CarIcon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">Car Driving</p>
                          <p className="text-sm font-semibold text-white">
                            {result.equivalents.car_km.toLocaleString()} km
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                        <TreePine className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-xs text-gray-400">Trees Needed</p>
                          <p className="text-sm font-semibold text-white">
                            {result.equivalents.trees_needed.toFixed(0)} trees
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                        <Users className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Person Days</p>
                          <p className="text-sm font-semibold text-white">
                            {result.equivalents.person_days.toFixed(0)} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-300">
                        <strong>Note:</strong> CFCs have extremely high Global Warming Potential (GWP). 
                        {result.refrigerant_type} has a GWP of {result.gwp.toLocaleString()}, meaning 
                        1 kg of this refrigerant equals {result.gwp.toLocaleString()} kg of CO₂ in 
                        warming potential. Proper disposal and recovery are crucial!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

