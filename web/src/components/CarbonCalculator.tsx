import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, UtensilsCrossed, Zap, ShoppingBag, Sparkles, Package, TreePine, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CarbonSuggestions from "@/components/CarbonSuggestions";
import { Tooltip } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface CalculatorForm {
  category: "transport" | "diet" | "energy" | "shopping" | "lifestyle" | "other";
  activity: string;
  amount: number;
  unit?: string;
  metadata?: Record<string, any>;
}

// Helper function to format activity names for display
const formatActivityName = (activity: string, category: string): string => {
  if (category === "lifestyle") {
    const activityMap: Record<string, string> = {
      streaming_hour: "Video Streaming",
      internet_gb: "Internet Data Usage",
      email: "Email",
      phone_call: "Phone Call",
      social_media: "Social Media",
      laundry_load: "Washing Machine",
      hand_wash_clothes: "Hand Washing Clothes",
      shower_10min: "Hot Shower",
      shower_cold: "Cold Shower",
      bath: "Bath",
      bucket_bath: "Bucket Bath",
      cooking_gas: "Cooking (Gas)",
      cooking_electric: "Cooking (Electric)",
      fan_hour: "Ceiling Fan",
      fan_energy_efficient: "Energy-Efficient Fan",
      ac_hour_1ton: "AC 1 Ton",
      "ac_hour_1.5ton": "AC 1.5 Ton",
      ac_hour_2ton: "AC 2 Ton",
      ac_hour: "AC Usage",
      refrigerator_small: "Refrigerator Small",
      refrigerator_medium: "Refrigerator Medium",
      refrigerator_large: "Refrigerator Large",
      led_bulb_7w: "LED Bulb 7W",
      led_bulb_12w: "LED Bulb 12W",
      cfl_bulb_15w: "CFL Bulb 15W",
      light_bulb_hour: "Light Bulb",
      tv_led_32: "LED TV 32\"",
      tv_led_42plus: "LED TV 42\"+",
      tv_hour: "TV Watching",
      washing_machine_semi: "Washing Machine Semi-Auto",
      washing_machine_auto: "Washing Machine Auto",
      water_pump_submersible: "Water Pump Submersible",
      water_pump_surface: "Water Pump Surface",
      electric_iron: "Electric Iron",
      rice_cooker: "Rice Cooker",
      electric_kettle: "Electric Kettle",
      waste_kg: "Waste Disposal",
      newspaper: "Newspaper",
      magazine: "Magazine",
      event_attendee: "Event Attendance",
      wedding_attendee: "Wedding Attendance",
      restaurant_meal: "Restaurant Meal",
      takeaway_meal: "Takeaway Meal",
      haircut: "Haircut",
      ironing: "Ironing Clothes",
      cleaning: "House Cleaning",
    };
    return activityMap[activity] || activity;
  }
  
  if (category === "transport") {
    const transportMap: Record<string, string> = {
      car: "Car (Average)",
      car_small: "Small Car",
      car_large: "Large Car/SUV",
      hybrid_car: "Hybrid Car",
      electric_vehicle: "Electric Vehicle",
      plane: "Plane (Domestic)",
      plane_international: "Plane (International)",
      motorcycle: "Motorcycle",
      scooter: "Scooter",
      bike: "Bicycle",
      walking: "Walking",
      rickshaw: "Cycle Rickshaw",
      auto_rickshaw: "Auto Rickshaw",
      cng: "CNG Vehicle",
      boat: "Boat/Launch",
      tuk_tuk: "Tuk-tuk",
    };
    return transportMap[activity] || activity;
  }
  
  return activity;
};

const CATEGORY_CONFIG: Record<string, { 
  color: string; 
  accentColor: string; 
  icon: LucideIcon; 
  label: string; 
  description: string;
}> = {
  transport: { 
    color: "border-blue-500/50 bg-blue-900/20", 
    accentColor: "text-blue-400",
    icon: Car,
    label: "Transport",
    description: "Calculate emissions from your travel"
  },
  diet: { 
    color: "border-green-500/50 bg-green-900/20", 
    accentColor: "text-green-400",
    icon: UtensilsCrossed,
    label: "Diet",
    description: "Food and beverage consumption"
  },
  energy: { 
    color: "border-yellow-500/50 bg-yellow-900/20", 
    accentColor: "text-yellow-400",
    icon: Zap,
    label: "Energy",
    description: "Home energy usage"
  },
  shopping: { 
    color: "border-purple-500/50 bg-purple-900/20", 
    accentColor: "text-purple-400",
    icon: ShoppingBag,
    label: "Shopping",
    description: "Purchases and consumption"
  },
  lifestyle: { 
    color: "border-pink-500/50 bg-pink-900/20", 
    accentColor: "text-pink-400",
    icon: Sparkles,
    label: "Lifestyle",
    description: "Daily lifestyle choices"
  },
  other: { 
    color: "border-gray-200 bg-gray-50", 
    accentColor: "text-gray-600",
    icon: Package,
    label: "Other",
    description: "Custom activities"
  },
};

export default function CarbonCalculator() {
  const [category, setCategory] = useState<CalculatorForm["category"]>("transport");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<{ carbon: number; activity: string; points?: number } | null>(null);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [dailyTip, setDailyTip] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    mode: string;
    distance: number;
    passengers: number;
    mealType: string;
    quantity: number;
    energyType: string;
    consumption: number;
    itemType: string;
    items: number;
    lifestyleActivity: string;
    lifestyleAmount: number;
    lifestyleUnit: string;
    otherActivity: string;
    otherAmount: number;
    otherUnit: string;
  }>({
    mode: "car",
    distance: 0,
    passengers: 1,
    mealType: "beef",
    quantity: 0,
    energyType: "electricity_grid",
    consumption: 0,
    itemType: "clothing",
    items: 1,
    lifestyleActivity: "streaming_hour",
    lifestyleAmount: 0,
    lifestyleUnit: "hour",
    otherActivity: "",
    otherAmount: 0,
    otherUnit: "item",
  });


  const resetCalculator = () => {
    setResult(null);
    setSuggestions(null);
    setDailyTip(null);
    setError(null);
    // Reset category to default
    setCategory("transport");
    // Reset form data to initial values
    setFormData({
      mode: "car",
      distance: 0,
      passengers: 1,
      mealType: "beef",
      quantity: 0,
      energyType: "electricity_grid",
      consumption: 0,
      itemType: "clothing",
      items: 1,
      lifestyleActivity: "streaming_hour",
      lifestyleAmount: 0,
      lifestyleUnit: "hour",
      otherActivity: "",
      otherAmount: 0,
      otherUnit: "item",
    });
  };

  const calculateAndSave = async () => {
    setLoading(true);
    setLoadingProgress(0);
    setResult(null);
    setError(null);
    setSuggestions(null);
    setDailyTip(null);
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    try {
      // Validate inputs
      if (category === "transport" && formData.distance <= 0) {
        setError("Please enter a valid distance");
        setLoading(false);
        return;
      }
      if (category === "diet" && formData.quantity <= 0) {
        setError("Please enter a valid quantity");
        setLoading(false);
        return;
      }
      if (category === "energy" && formData.consumption <= 0) {
        setError("Please enter a valid consumption amount");
        setLoading(false);
        return;
      }
      if (category === "shopping" && formData.items <= 0) {
        setError("Please enter a valid quantity");
        setLoading(false);
        return;
      }
      if (category === "lifestyle" && formData.lifestyleAmount <= 0) {
        setError("Please enter a valid amount");
        setLoading(false);
        return;
      }
      if (category === "other" && (!formData.otherActivity || formData.otherAmount <= 0)) {
        setError("Please enter activity and amount");
        setLoading(false);
        return;
      }

      let requestData: any = { category };

      switch (category) {
        case "transport":
          requestData = {
            category: "transport",
            activity: formData.mode,
            carbon_amount_kg: 0,
            metadata: {
              distance_km: formData.distance,
              passengers: formData.passengers,
            },
          };
          break;
        case "diet":
          requestData = {
            category: "diet",
            activity: formData.mealType,
            carbon_amount_kg: 0,
            metadata: {
              quantity_kg: formData.quantity,
            },
          };
          break;
        case "energy":
          requestData = {
            category: "energy",
            activity: formData.energyType,
            carbon_amount_kg: 0,
            metadata: {
              amount: formData.consumption,
              unit: "kwh",
            },
          };
          break;
        case "shopping":
          requestData = {
            category: "shopping",
            activity: formData.itemType,
            carbon_amount_kg: 0,
            metadata: {
              quantity: formData.items,
            },
          };
          break;
        case "lifestyle":
          requestData = {
            category: "lifestyle",
            activity: formData.lifestyleActivity,
            carbon_amount_kg: 0,
            metadata: {
              amount: formData.lifestyleAmount,
              unit: formData.lifestyleUnit,
            },
          };
          break;
        default:
          // For "other" category, allow manual entry as fallback
          requestData = {
            category: "other",
            activity: formData.otherActivity,
            carbon_amount_kg: formData.otherAmount,
            metadata: {
              unit: formData.otherUnit,
            },
          };
      }

      // Use api directly to handle response properly
      const { api } = await import("@/lib/api.ts");
      const response = await api.post("/api/v1/carbon/logs", requestData);
      
      // API returns: { success: true, data: {...}, points_awarded: X, user_stats: {...} }
      const responseBody = response.data;
      
      // Extract data from response
      const logData = responseBody?.data;
      const pointsAwarded = responseBody?.points_awarded || 0;
      const userStats = responseBody?.user_stats;
      
      // Validate and extract carbon amount
      if (!logData || logData.carbon_amount_kg === undefined) {
        console.error("Invalid response format:", responseBody);
        throw new Error("Invalid response from server. Please try again.");
      }
      
      setResult({
        carbon: logData.carbon_amount_kg || 0,
        activity: logData.activity || requestData.activity || "Unknown",
        points: pointsAwarded,
      });

      // Extract and set suggestions from response
      if (responseBody?.suggestions) {
        setSuggestions(responseBody.suggestions);
      }

      // Fetch daily tip if not already set
      if (!dailyTip) {
        try {
          const { api } = await import("@/lib/api.ts");
          const tipResponse = await api.get("/api/v1/carbon/suggestions/daily-tip");
          if (tipResponse.data?.success && tipResponse.data?.data?.tip) {
            setDailyTip(tipResponse.data.data.tip);
          }
        } catch (err) {
          console.error("Failed to fetch daily tip:", err);
        }
      }

      // Update user stats if provided
      if (userStats) {
        updateUser(userStats);
      }

      // Invalidate queries to refetch stats
      queryClient.invalidateQueries({ queryKey: ["carbon"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    } catch (error: any) {
      console.error("Failed to calculate and save:", error);
      let errorMessage = "Failed to calculate. Please try again.";
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setError(errorMessage);
    } finally {
      setLoadingProgress(100);
      setTimeout(() => {
        setLoading(false);
        setLoadingProgress(0);
      }, 300);
    }
  };

  const categoryInfo = CATEGORY_CONFIG[category];

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Apple-style Frosted Glass Container */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-full">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a] opacity-90 pointer-events-none" />
        
        {/* Subtle animated gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        {/* Hero Section */}
        <motion.div 
          className="relative px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 text-center z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 backdrop-blur-lg shadow-lg flex items-center justify-center border border-white/20">
              <Zap className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-3 sm:mb-4 tracking-tight px-4">
            Carbon Footprint Calculator
          </h2>
          <p className="text-gray-400 text-center mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Calculate your emissions and get reduction tips instantly.
          </p>
        </motion.div>

        {/* Calculator Content */}
        <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
          {/* Category Selection */}
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-white mb-2 block tracking-tight">
                Select Category
              </Label>
              <Tooltip 
                content="Choose the category that best matches your activity. Each category uses different emission factors for accurate calculations."
                side="right"
              >
                <p className="text-sm text-gray-400 mb-6 cursor-help">
                  Choose the type of activity you want to calculate
                </p>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <AnimatePresence mode="wait">
                {Object.entries(CATEGORY_CONFIG).map(([cat, config], index) => {
                  const IconComponent = config.icon;
                  const isSelected = category === cat;
                  return (
                    <motion.button
                      key={cat}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCategory(cat as any)}
                      className={`relative p-3 sm:p-4 md:p-5 rounded-xl border transition-all duration-300 text-left overflow-hidden group min-h-[80px] sm:min-h-[100px] ${
                        isSelected
                          ? "bg-white/10 border-white/30 shadow-lg shadow-green-500/20 scale-105"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {/* Gradient glow on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${isSelected ? 'from-green-500/20 to-emerald-600/20' : 'from-transparent to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                      
                      <div className="relative z-10 flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                            : 'bg-white/10 group-hover:bg-white/20'
                        } transition-all duration-300`}>
                          <IconComponent 
                            className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} 
                            strokeWidth={2.5} 
                          />
                        </div>
                        <div className={`text-sm font-bold capitalize transition-colors ${
                          isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}>
                          {config.label}
                        </div>
                      </div>
                      <p className={`text-xs relative z-10 transition-colors ${
                        isSelected ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
                      }`}>
                        {config.description}
                      </p>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Form Section with Smooth Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const IconComponent = categoryInfo.icon;
                  return (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
                    >
                      <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </motion.div>
                  );
                })()}
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{categoryInfo.label}</h3>
                  <p className="text-sm text-gray-400">{categoryInfo.description}</p>
                </div>
              </div>

              {/* Transport Form */}
              {category === "transport" && (
                <div className="space-y-4 sm:space-y-5 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10">
                <div>
                  <Label htmlFor="mode" className="text-sm font-semibold text-white mb-2 block">
                    Transportation Mode
                  </Label>
                  <select
                    id="mode"
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-white/20 backdrop-blur-sm text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-500 text-base"
                    style={{ backgroundColor: '#3B3B3B' }}
                  >
                    <option value="car" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Car (Average)</option>
                    <option value="car_small" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Small Car</option>
                    <option value="car_large" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Large Car/SUV</option>
                    <option value="hybrid_car" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Hybrid Car</option>
                    <option value="electric_vehicle" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Electric Vehicle</option>
                    <option value="plane" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Plane (Domestic)</option>
                    <option value="plane_international" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Plane (International)</option>
                    <option value="motorcycle" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Motorcycle</option>
                    <option value="scooter" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Scooter</option>
                    <option value="rickshaw" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Cycle Rickshaw</option>
                    <option value="auto_rickshaw" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Auto Rickshaw</option>
                    <option value="cng" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>CNG Vehicle</option>
                    <option value="tuk_tuk" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Tuk-tuk</option>
                    <option value="boat" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Boat/Launch</option>
                    <option value="bike" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Bicycle</option>
                    <option value="walking" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Walking</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Select your mode of transportation</p>
                </div>
                <div>
                  <Label htmlFor="distance" className="text-sm font-semibold text-white mb-2 block">
                    Distance (km)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.distance || ""}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 50"
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter the distance traveled in kilometers</p>
                </div>
                <div>
                  <Label htmlFor="passengers" className="text-sm font-semibold text-white mb-2 block">
                    Number of Passengers
                  </Label>
                  <Input
                    id="passengers"
                    type="number"
                    min="1"
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Include yourself in the passenger count</p>
                </div>
              </div>
            )}

            {/* Diet Form */}
            {category === "diet" && (
              <div className="space-y-4 sm:space-y-5 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10">
                <div>
                  <Label htmlFor="mealType" className="text-sm font-semibold text-white mb-2 block">
                    Food Type
                  </Label>
                  <select
                    id="mealType"
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-white/20 backdrop-blur-sm text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-500 text-base"
                    style={{ backgroundColor: '#3B3B3B' }}
                  >
                    <optgroup label="Meat & Protein">
                      <option value="beef" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Beef</option>
                      <option value="mutton" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Mutton/Goat</option>
                      <option value="pork" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Pork</option>
                      <option value="chicken" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Chicken</option>
                      <option value="duck" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Duck</option>
                      <option value="fish" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Fish</option>
                      <option value="seafood" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Seafood</option>
                      <option value="prawn" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Prawn/Shrimp</option>
                      <option value="eggs" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Eggs</option>
                    </optgroup>
                    <optgroup label="Dairy">
                      <option value="milk" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Milk</option>
                      <option value="yogurt" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Yogurt/Dahi</option>
                      <option value="cheese" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Cheese</option>
                      <option value="butter" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Butter</option>
                      <option value="ghee" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Ghee</option>
                    </optgroup>
                    <optgroup label="Grains & Staples">
                      <option value="rice" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Rice</option>
                      <option value="wheat" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Wheat</option>
                      <option value="roti" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Roti/Chapati</option>
                      <option value="naan" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Naan</option>
                      <option value="bread" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Bread</option>
                      <option value="pasta" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Pasta</option>
                      <option value="noodles" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Noodles</option>
                    </optgroup>
                    <optgroup label="Legumes & Pulses">
                      <option value="dal" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Dal/Lentils</option>
                      <option value="lentils" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Lentils</option>
                      <option value="chickpeas" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Chickpeas/Chana</option>
                      <option value="beans" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Beans</option>
                      <option value="black_gram" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Black Gram/Mash Dal</option>
                      <option value="mung_bean" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Mung Bean</option>
                    </optgroup>
                    <optgroup label="Vegetables">
                      <option value="vegetables" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Mixed Vegetables</option>
                      <option value="potatoes" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Potatoes</option>
                      <option value="onion" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Onion</option>
                      <option value="tomato" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Tomato</option>
                      <option value="brinjal" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Brinjal/Eggplant</option>
                      <option value="okra" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Okra/Ladyfinger</option>
                      <option value="cauliflower" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Cauliflower</option>
                      <option value="cabbage" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Cabbage</option>
                      <option value="spinach" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Spinach/Palak</option>
                      <option value="pumpkin" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Pumpkin</option>
                    </optgroup>
                    <optgroup label="Fruits">
                      <option value="fruits" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Mixed Fruits</option>
                      <option value="mango" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Mango</option>
                      <option value="banana" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Banana</option>
                      <option value="jackfruit" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Jackfruit</option>
                      <option value="coconut" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Coconut</option>
                      <option value="papaya" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Papaya</option>
                      <option value="guava" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Guava</option>
                    </optgroup>
                    <optgroup label="Bangladeshi Dishes">
                      <option value="biryani" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Biryani (General)</option>
                      <option value="chicken_biryani" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Chicken Biryani</option>
                      <option value="beef_biryani" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Beef Biryani</option>
                      <option value="mutton_biryani" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Mutton Biryani</option>
                      <option value="kachchi_biryani" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Kachchi Biryani</option>
                      <option value="polao" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Polao</option>
                      <option value="khichuri" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Khichuri</option>
                      <option value="tehari" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Tehari</option>
                      <option value="haleem" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Haleem</option>
                    </optgroup>
                    <optgroup label="Curry Dishes">
                      <option value="curry" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Curry (General)</option>
                      <option value="chicken_curry" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Chicken Curry</option>
                      <option value="beef_curry" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Beef Curry</option>
                      <option value="fish_curry" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Fish Curry</option>
                      <option value="dal_curry" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Dal Curry</option>
                      <option value="vegetable_curry" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Vegetable Curry</option>
                    </optgroup>
                    <optgroup label="Street Food">
                      <option value="fuchka" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Fuchka/Panipuri</option>
                      <option value="chotpoti" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Chotpoti</option>
                      <option value="jhalmuri" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Jhalmuri</option>
                      <option value="shingara" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Shingara/Samosa</option>
                      <option value="paratha" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Paratha</option>
                      <option value="halim" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Halim</option>
                    </optgroup>
                    <optgroup label="Sweets (Mithai)">
                      <option value="sweets" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Sweets/Mithai (General)</option>
                      <option value="rasgulla" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Rasgulla</option>
                      <option value="gulab_jamun" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Gulab Jamun</option>
                      <option value="sandesh" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Sandesh</option>
                      <option value="roshogolla" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Roshogolla</option>
                      <option value="mishti_doi" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Mishti Doi</option>
                    </optgroup>
                    <optgroup label="Other Processed Foods">
                      <option value="snacks" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Snacks</option>
                      <option value="tofu" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Tofu</option>
                      <option value="nuts" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Nuts</option>
                    </optgroup>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Select the type of food consumed</p>
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-sm font-semibold text-white mb-2 block">
                    Quantity (kg)
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.quantity || ""}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 0.5"
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter the weight in kilograms</p>
                </div>
              </div>
            )}

            {/* Energy Form */}
            {category === "energy" && (
              <div className="space-y-4 sm:space-y-5 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10">
                <div>
                  <Label htmlFor="energyType" className="text-sm font-semibold text-white mb-2 block">
                    Energy Type
                  </Label>
                  <select
                    id="energyType"
                    value={formData.energyType}
                    onChange={(e) => setFormData({ ...formData, energyType: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-white/20 backdrop-blur-sm text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-500 text-base"
                    style={{ backgroundColor: '#3B3B3B' }}
                  >
                    <option value="electricity_grid" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Grid Electricity (Global Average)</option>
                    <option value="electricity_bangladesh" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Grid Electricity (Bangladesh) 🇧🇩</option>
                    <option value="natural_gas" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Natural Gas</option>
                    <option value="heating_oil" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Heating Oil</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Select your energy source</p>
                </div>
                <div>
                  <Label htmlFor="consumption" className="text-sm font-semibold text-white mb-2 block">
                    Consumption (kWh)
                  </Label>
                  <Input
                    id="consumption"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.consumption || ""}
                    onChange={(e) => setFormData({ ...formData, consumption: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 100"
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter energy consumption in kilowatt-hours</p>
                </div>
              </div>
            )}

            {/* Shopping Form */}
            {category === "shopping" && (
              <div className="space-y-4 sm:space-y-5 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10">
                <div>
                  <Label htmlFor="itemType" className="text-sm font-semibold text-white mb-2 block">
                    Item Type
                  </Label>
                  <select
                    id="itemType"
                    value={formData.itemType}
                    onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                    className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-white/20 backdrop-blur-sm text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-500 text-base"
                    style={{ backgroundColor: '#3B3B3B' }}
                  >
                    <optgroup label="Clothing & Accessories">
                      <option value="clothing" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Clothing (T-shirt)</option>
                      <option value="jeans" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Jeans</option>
                      <option value="shoes" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Shoes</option>
                      <option value="sari" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Sari</option>
                      <option value="kurta" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Kurta</option>
                      <option value="sandals" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Sandals</option>
                    </optgroup>
                    <optgroup label="Daily Consumables">
                      <option value="books" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Books</option>
                      <option value="toiletries" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Toiletries</option>
                      <option value="soap" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Soap</option>
                      <option value="shampoo" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Shampoo</option>
                      <option value="toothpaste" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Toothpaste</option>
                      <option value="detergent" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Detergent</option>
                    </optgroup>
                    <optgroup label="Packaging & Bags">
                      <option value="packaging" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Packaging Materials</option>
                      <option value="plastic_bags" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Plastic Bags</option>
                      <option value="paper_bag" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Paper Bag</option>
                      <option value="jute_bag" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Jute Bag</option>
                      <option value="takeaway_container" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Takeaway Container</option>
                      <option value="water_bottle" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Water Bottle</option>
                    </optgroup>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Select the type of item purchased</p>
                </div>
                <div>
                  <Label htmlFor="items" className="text-sm font-semibold text-white mb-2 block">
                    Quantity
                  </Label>
                  <Input
                    id="items"
                    type="number"
                    min="1"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: parseInt(e.target.value) || 1 })}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter the number of items</p>
                </div>
              </div>
            )}

            {/* Lifestyle Form */}
            {category === "lifestyle" && (
              <div className="space-y-4 sm:space-y-5 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10">
                <div>
                  <Label htmlFor="lifestyleActivity" className="text-sm font-semibold text-white mb-2 block">
                    Lifestyle Activity
                  </Label>
                  <select
                    id="lifestyleActivity"
                    value={formData.lifestyleActivity}
                    onChange={(e) => {
                      const activity = e.target.value;
                      let unit = "hour";
                      if (activity === "laundry_load" || activity === "hand_wash_clothes" || activity === "washing_machine_semi" || activity === "washing_machine_auto") unit = "load";
                      else if (activity === "shower_10min" || activity === "shower_cold" || activity === "bath" || activity === "bucket_bath") unit = "time";
                      else if (activity === "internet_gb") unit = "gb";
                      else if (activity === "email") unit = "email";
                      else if (activity === "phone_call") unit = "minute";
                      else if (activity === "waste_kg") unit = "kg";
                      else if (activity === "newspaper" || activity === "magazine") unit = "issue";
                      else if (activity === "event_attendee" || activity === "wedding_attendee") unit = "person";
                      else if (activity === "restaurant_meal" || activity === "takeaway_meal") unit = "meal";
                      else if (activity === "haircut" || activity === "ironing" || activity === "cleaning") unit = "session";
                      else if (activity.includes("refrigerator")) unit = "day";
                      else if (activity === "rice_cooker" || activity === "electric_kettle") unit = "use";
                      else if (activity.includes("_hour") || activity.includes("_ton") || activity.includes("bulb") || activity.includes("fan") || activity.includes("tv") || activity.includes("pump") || activity === "electric_iron" || activity === "ac_hour") unit = "hour";
                      setFormData({ ...formData, lifestyleActivity: activity, lifestyleUnit: unit });
                    }}
                    className="w-full px-4 py-3 min-h-[44px] rounded-lg border border-white/20 backdrop-blur-sm text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-500 text-base"
                    style={{ backgroundColor: '#3B3B3B' }}
                  >
                    <optgroup label="Digital Activities">
                      <option value="streaming_hour" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Video Streaming (per hour)</option>
                      <option value="internet_gb" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Internet Data Usage (per GB)</option>
                      <option value="email" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Email Sent (per email)</option>
                      <option value="phone_call" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Phone Call (per minute)</option>
                      <option value="social_media" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Social Media (per hour)</option>
                    </optgroup>
                    <optgroup label="Home Activities">
                      <option value="laundry_load" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Washing Machine (per load)</option>
                      <option value="hand_wash_clothes" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Hand Washing Clothes (per load)</option>
                      <option value="shower_10min" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Hot Shower (per 10 min)</option>
                      <option value="shower_cold" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Cold Shower (per 10 min)</option>
                      <option value="bath" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Bath (per bath)</option>
                      <option value="bucket_bath" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Bucket Bath (per bath)</option>
                      <option value="cooking_gas" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Cooking with Gas (per hour)</option>
                      <option value="cooking_electric" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Cooking with Electricity (per hour)</option>
                    </optgroup>
                    <optgroup label="Appliances - Fans & Cooling 🇧🇩">
                      <option value="fan_hour" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Ceiling Fan (per hour)</option>
                      <option value="fan_energy_efficient" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Energy-Efficient Fan (per hour)</option>
                      <option value="ac_hour_1ton" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>AC 1 Ton (per hour)</option>
                      <option value="ac_hour_1.5ton" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>AC 1.5 Ton (per hour)</option>
                      <option value="ac_hour_2ton" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>AC 2 Ton (per hour)</option>
                      <option value="ac_hour" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>AC Usage - Average (per hour)</option>
                    </optgroup>
                    <optgroup label="Appliances - Refrigeration">
                      <option value="refrigerator_small" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Refrigerator Small (150L) - per day</option>
                      <option value="refrigerator_medium" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Refrigerator Medium (250L) - per day</option>
                      <option value="refrigerator_large" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Refrigerator Large (350L+) - per day</option>
                    </optgroup>
                    <optgroup label="Appliances - Lighting">
                      <option value="led_bulb_7w" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>LED Bulb 7W (per hour)</option>
                      <option value="led_bulb_12w" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>LED Bulb 12W (per hour)</option>
                      <option value="cfl_bulb_15w" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>CFL Bulb 15W (per hour)</option>
                      <option value="light_bulb_hour" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Light Bulb - Average (per hour)</option>
                    </optgroup>
                    <optgroup label="Appliances - Entertainment">
                      <option value="tv_led_32" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>LED TV 32" (per hour)</option>
                      <option value="tv_led_42plus" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>LED TV 42"+ (per hour)</option>
                      <option value="tv_hour" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>TV Watching - Average (per hour)</option>
                    </optgroup>
                    <optgroup label="Appliances - Other">
                      <option value="washing_machine_semi" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Washing Machine Semi-Auto (per load)</option>
                      <option value="washing_machine_auto" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Washing Machine Auto (per load)</option>
                      <option value="water_pump_submersible" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Water Pump Submersible (per hour)</option>
                      <option value="water_pump_surface" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Water Pump Surface (per hour)</option>
                      <option value="electric_iron" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Electric Iron (per hour)</option>
                      <option value="rice_cooker" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Rice Cooker (per use)</option>
                      <option value="electric_kettle" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Electric Kettle (per use)</option>
                    </optgroup>
                    <optgroup label="Daily Activities">
                      <option value="waste_kg" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Waste Disposal (per kg)</option>
                      <option value="newspaper" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Newspaper (per issue)</option>
                      <option value="magazine" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Magazine (per issue)</option>
                      <option value="event_attendee" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Event Attendance (per person)</option>
                      <option value="wedding_attendee" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Wedding Attendance (per person)</option>
                      <option value="restaurant_meal" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Restaurant Meal (per meal)</option>
                      <option value="takeaway_meal" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Takeaway Meal (per meal)</option>
                    </optgroup>
                    <optgroup label="Personal Care">
                      <option value="haircut" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Haircut (per service)</option>
                      <option value="ironing" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>Ironing Clothes (per session)</option>
                      <option value="cleaning" style={{ backgroundColor: '#3B3B3B', color: '#ffffff' }}>House Cleaning (per session)</option>
                    </optgroup>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Select the type of lifestyle activity</p>
                </div>
                <div>
                  <Label htmlFor="lifestyleAmount" className="text-sm font-semibold text-white mb-2 block">
                    Amount ({formData.lifestyleUnit === "hour" ? "Hours" : formData.lifestyleUnit === "gb" ? "GB" : formData.lifestyleUnit === "night" ? "Nights" : formData.lifestyleUnit === "load" ? "Loads" : formData.lifestyleUnit === "time" ? "Times" : formData.lifestyleUnit === "email" ? "Emails" : formData.lifestyleUnit === "kg" ? "Kilograms" : formData.lifestyleUnit === "issue" ? "Issues" : formData.lifestyleUnit === "person" ? "People" : "Items"})
                  </Label>
                  <Input
                    id="lifestyleAmount"
                    type="number"
                    min="0"
                    step={formData.lifestyleUnit === "gb" || formData.lifestyleUnit === "kg" ? "0.1" : "1"}
                    value={formData.lifestyleAmount || ""}
                    onChange={(e) => setFormData({ ...formData, lifestyleAmount: parseFloat(e.target.value) || 0 })}
                    placeholder={`e.g., ${formData.lifestyleUnit === "hour" ? "2" : formData.lifestyleUnit === "gb" ? "10" : formData.lifestyleUnit === "night" ? "3" : formData.lifestyleUnit === "load" ? "5" : formData.lifestyleUnit === "time" ? "1" : formData.lifestyleUnit === "email" ? "50" : formData.lifestyleUnit === "kg" ? "5" : formData.lifestyleUnit === "issue" ? "7" : formData.lifestyleUnit === "person" ? "100" : "1"}`}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter the quantity or duration</p>
                </div>
              </div>
            )}

            {/* Other Form */}
            {category === "other" && (
              <div className="space-y-4 sm:space-y-5 bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10">
                <div>
                  <Label htmlFor="otherActivity" className="text-sm font-semibold text-white mb-2 block">
                    Activity Description
                  </Label>
                  <Input
                    id="otherActivity"
                    type="text"
                    value={formData.otherActivity}
                    onChange={(e) => setFormData({ ...formData, otherActivity: e.target.value })}
                    placeholder="e.g., Custom activity or event"
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Describe the activity or item</p>
                </div>
                <div>
                  <Label htmlFor="otherAmount" className="text-sm font-semibold text-white mb-2 block">
                    Carbon Amount (kg CO₂)
                  </Label>
                  <Input
                    id="otherAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.otherAmount || ""}
                    onChange={(e) => setFormData({ ...formData, otherAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 2.5"
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-500 focus:border-green-500 min-h-[44px] text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter the carbon dioxide equivalent if you know it, otherwise leave at 0</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-500/10 backdrop-blur-sm border-2 border-red-500/30 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">⚠</span>
                  </div>
                  <p className="text-sm font-semibold text-red-300">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Result Display */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm border-2 border-green-500/30 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl sm:text-2xl">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-white mb-1 break-words">Calculation Complete!</h4>
                    <p className="text-xs sm:text-sm text-gray-300 mb-3 break-words">
                      Your carbon footprint for <span className="font-semibold text-white break-words">{formatActivityName(result.activity, category)}</span> has been calculated.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20 overflow-hidden">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xl sm:text-2xl md:text-3xl font-black text-white break-all">
                          {result.carbon.toFixed(2)}
                        </span>
                        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-300 whitespace-nowrap">kg CO₂</span>
                      </div>
                      {result.points && (
                        <div className="mt-2 text-xs sm:text-sm text-green-300">
                          <span className="font-semibold">+{result.points} points</span> earned
                        </div>
                      )}
                    </div>
                    {result.carbon > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <Button
                          onClick={() => navigate(`/tree-planting?carbon=${result.carbon}`)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg py-3 min-h-[44px] text-xs sm:text-sm md:text-base font-medium mb-3 touch-manipulation whitespace-normal"
                        >
                          <TreePine className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-center break-words">Calculate Trees Needed to Offset This Carbon</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Suggestions Display */}
            {suggestions && (
              <div className="mt-6">
                <CarbonSuggestions suggestions={suggestions} dailyTip={dailyTip || undefined} />
              </div>
            )}

            {/* Calculate Button / Calculate Again Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {result ? (
                <Button
                  onClick={resetCalculator}
                  className="w-full py-4 sm:py-6 min-h-[44px] text-base sm:text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 touch-manipulation"
                >
                  Calculate Again
                </Button>
              ) : (
                <div className="space-y-2">
                  {loading && (
                    <Progress 
                      value={loadingProgress} 
                      showLabel={false}
                      size="sm"
                      color="success"
                      className="w-full"
                    />
                  )}
                  <Tooltip 
                    content="Calculate your carbon footprint based on the selected activity and amount"
                    side="top"
                  >
                    <Button
                      onClick={calculateAndSave}
                      disabled={loading}
                      className="w-full py-6 min-h-[44px] text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Calculating... {loadingProgress > 0 && `${loadingProgress}%`}
                        </span>
                      ) : (
                        "Calculate Carbon Footprint"
                      )}
                    </Button>
                  </Tooltip>
                </div>
              )}
            </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
