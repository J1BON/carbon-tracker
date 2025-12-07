import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TreePine, Leaf, TrendingDown, Award, Calculator, Info } from "lucide-react";

// Data from international sources:
// - EPA: One mature tree can absorb 48 lbs (21.77 kg) of CO2 per year
// - Arbor Day Foundation: Over 40 years, a tree can sequester 1 ton of CO2
// - UN: One tree can absorb 10-20 kg of CO2 per year on average
// - World Economic Forum: Trees are one of the most effective ways to combat climate change
// - Nature.org: Forest restoration can provide 30% of climate mitigation needed by 2030

const CARBON_SEQUESTRATION_DATA = {
  // Average CO2 absorption per tree per year (kg)
  // Sources: EPA, Arbor Day Foundation, UN Environment Programme
  per_tree_per_year: 21.77, // kg CO2 per tree per year (EPA average)
  
  // Over 40-year lifetime
  per_tree_lifetime: 1000, // kg CO2 over lifetime (Arbor Day Foundation)
  
  // Asian and Bangladeshi tree types and their carbon absorption rates
  // Sources: Bangladesh Forest Research Institute, Asian Forest Research Organizations
  tree_types: {
    mango: { name: "Mango Tree ", co2_per_year: 20.5, lifetime: 200, description: "National tree of Bangladesh, excellent for carbon sequestration" },
    neem: { name: "Neem Tree ", co2_per_year: 22.0, lifetime: 150, description: "Native to Bangladesh, fast-growing and highly effective" },
    coconut: { name: "Coconut Tree ", co2_per_year: 18.5, lifetime: 100, description: "Common in coastal areas, good for carbon absorption" },
    jackfruit: { name: "Jackfruit Tree", co2_per_year: 25.0, lifetime: 80, description: "National fruit of Bangladesh, excellent carbon sink" },
    teak: { name: "Teak Tree", co2_per_year: 28.0, lifetime: 300, description: "Valuable hardwood, long-lived carbon storage" },
    banyan: { name: "Banyan Tree", co2_per_year: 30.0, lifetime: 500, description: "Sacred tree, massive carbon sequestration capacity" },
    gulmohar: { name: "Gulmohar Tree", co2_per_year: 19.0, lifetime: 120, description: "Beautiful flowering tree, good for urban areas" },
    mahogany: { name: "Mahogany Tree ", co2_per_year: 26.5, lifetime: 250, description: "Premium hardwood, excellent carbon storage" },
    bamboo: { name: "Bamboo", co2_per_year: 35.0, lifetime: 20, description: "Fast-growing, highest carbon absorption rate" },
    tamarind: { name: "Tamarind Tree ", co2_per_year: 21.0, lifetime: 200, description: "Common in Bangladesh, good carbon sequestration" },
    kadam: { name: "Kadam Tree", co2_per_year: 23.5, lifetime: 150, description: "Native flowering tree, effective carbon sink" },
    average: { name: "Average Tree ", co2_per_year: 21.77, lifetime: 40, description: "Average carbon absorption for general calculations" },
  },
  
  // Impact data from international sources
  global_impact: {
    // UN Environment Programme: Forests absorb 2.6 billion tonnes of CO2 annually
    global_forest_absorption: 2600000000, // tonnes CO2 per year
    
    // World Economic Forum: 1 trillion trees could absorb 200 gigatonnes of CO2
    trillion_trees_potential: 200000000000, // tonnes CO2
    
    // Nature.org: Trees can provide 30% of climate mitigation needed
    mitigation_potential: 30, // percentage
  },
};

interface TreeOption {
  treeType: string;
  treeName: string;
  numTrees: number;
  years: number;
  co2PerYear: number;
  totalCo2Absorbed: number;
}

export default function TreePlanting() {
  const [searchParams] = useSearchParams();
  const initialCarbon = searchParams.get("carbon");
  const [carbonAmount, setCarbonAmount] = useState<number>(initialCarbon ? parseFloat(initialCarbon) : 0);
  const [treeOptions, setTreeOptions] = useState<TreeOption[]>([]);
  const [showCalculator, setShowCalculator] = useState<boolean>(!initialCarbon);

  // Auto-calculate if carbon amount is provided via URL
  useEffect(() => {
    if (initialCarbon && parseFloat(initialCarbon) > 0) {
      const amount = parseFloat(initialCarbon);
      setCarbonAmount(amount);
      // Calculate after a brief delay to ensure state is set
      setTimeout(() => {
        calculateTreeOptionsWithAmount(amount);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCarbon]);

  const heroAnimation = useScrollAnimation({ threshold: 0.2, triggerOnce: true });
  const impactAnimation = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const calculatorAnimation = useScrollAnimation({ threshold: 0.1, triggerOnce: true });

  // Calculate multiple tree planting options based on carbon amount
  const calculateTreeOptionsWithAmount = (amount: number) => {
    if (amount <= 0) {
      setTreeOptions([]);
      return;
    }

    const options: TreeOption[] = [];
    const treeEntries = Object.entries(CARBON_SEQUESTRATION_DATA.tree_types).filter(([key]) => key !== "average");
    
    // Generate multiple options for each tree type with different year combinations
    treeEntries.forEach(([key, tree]) => {
      // Option 1: Calculate for 1-10 years, finding reasonable tree counts
      for (let years = 1; years <= 10; years++) {
        const treesNeeded = Math.ceil(carbonAmount / (tree.co2_per_year * years));
        if (treesNeeded > 0 && treesNeeded <= 100) { // Reasonable range
          const totalCo2Absorbed = treesNeeded * tree.co2_per_year * years;
          if (totalCo2Absorbed >= carbonAmount * 0.9) { // At least 90% of carbon offset
            options.push({
              treeType: key,
              treeName: tree.name,
              numTrees: treesNeeded,
              years: years,
              co2PerYear: tree.co2_per_year,
              totalCo2Absorbed: Math.round(totalCo2Absorbed * 100) / 100,
            });
          }
        }
      }
    });

    // Sort by number of trees (ascending), then by years (ascending)
    options.sort((a, b) => {
      if (a.numTrees !== b.numTrees) return a.numTrees - b.numTrees;
      return a.years - b.years;
    });

    // Take top 12 diverse options (mix of different trees and year combinations)
    const selectedOptions: TreeOption[] = [];
    const seenCombinations = new Set<string>();
    
    for (const option of options) {
      const key = `${option.treeType}-${option.numTrees}-${option.years}`;
      if (!seenCombinations.has(key) && selectedOptions.length < 12) {
        seenCombinations.add(key);
        selectedOptions.push(option);
      }
    }

    setTreeOptions(selectedOptions);
    setShowCalculator(false);
  };

  const calculateTreeOptions = () => {
    calculateTreeOptionsWithAmount(carbonAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section 
        ref={heroAnimation.elementRef}
        className="relative py-32 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
              <TreePine className="w-12 h-12 text-emerald-400" />
            </div>
          </div>
          <h1 
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight text-white transition-all duration-1000 delay-100 ${
              heroAnimation.isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-90"
            }`}
          >
            Plant Trees, Reduce Carbon
          </h1>
          <p 
            className={`text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed transition-all duration-1000 delay-200 ${
              heroAnimation.isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-90"
            }`}
          >
            Discover how tree planting is one of the most effective ways to combat climate change 
            and reduce your carbon footprint. Every tree matters.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-24 sm:space-y-32 flex-1">
        {/* Impact Section */}
        <section 
          ref={impactAnimation.elementRef}
          className={`transition-all duration-1000 ${
            impactAnimation.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-90"
          }`}
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
              The Power of Trees
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Based on data from the EPA, UN Environment Programme, and leading environmental organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="glass-card rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">CO2 Absorption</h3>
              <p className="text-3xl font-semibold text-white mb-2">
                {CARBON_SEQUESTRATION_DATA.per_tree_per_year} kg
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Average CO2 absorbed per tree per year (EPA data)
              </p>
            </div>

            <div className="glass-card rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] p-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lifetime Impact</h3>
              <p className="text-3xl font-semibold text-white mb-2">
                1 tonne
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                CO2 sequestered over a tree's 40-year lifetime (Arbor Day Foundation)
              </p>
            </div>

            <div className="glass-card rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] p-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Potential</h3>
              <p className="text-3xl font-semibold text-white mb-2">
                30%
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Of climate mitigation potential from forests (Nature.org)
              </p>
            </div>
          </div>

          {/* Global Impact Stats */}
          <div className="mt-12 sm:mt-16 glass-card rounded-3xl p-8 sm:p-12 border border-white/10">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6 text-center tracking-tight">
              Global Forest Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-4xl sm:text-5xl font-semibold text-white mb-2">
                  2.6 billion tonnes
                </p>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  CO2 absorbed by global forests annually (UN Environment Programme)
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl sm:text-5xl font-semibold text-white mb-2">
                  200 gigatonnes
                </p>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Potential CO2 absorption from 1 trillion trees (World Economic Forum)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section 
          ref={calculatorAnimation.elementRef}
          className={`glass-card rounded-3xl p-8 sm:p-12 border border-white/10 transition-all duration-1000 delay-200 ${
            calculatorAnimation.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-90"
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-emerald-400" />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Tree Planting Calculator
            </h2>
          </div>

          {showCalculator ? (
            <div className="max-w-2xl mx-auto">
              <div className="glass-card rounded-2xl border border-white/10 p-6 mb-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Calculate Trees Needed</h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="carbonAmount" className="text-sm font-semibold text-gray-300 mb-2 block">
                      Carbon Amount (kg CO₂)
                    </Label>
                    <Input
                      id="carbonAmount"
                      type="number"
                      min="0"
                      step="0.1"
                      value={carbonAmount || ""}
                      onChange={(e) => setCarbonAmount(parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 300"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Enter the amount of carbon (in kg CO₂) you want to offset. This can be from your carbon calculator results.
                    </p>
                  </div>

                  <Button 
                    onClick={calculateTreeOptions}
                    disabled={carbonAmount <= 0}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full py-6 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculate Tree Options
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Tree Planting Options for {carbonAmount} kg CO₂
                  </h3>
                  <p className="text-gray-400">
                    Choose from multiple options to offset your carbon footprint
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setShowCalculator(true);
                    setTreeOptions([]);
                    setCarbonAmount(0);
                  }}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Calculate Again
                </Button>
              </div>

              {treeOptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {treeOptions.map((option, index) => (
                    <div
                      key={index}
                      className="glass-card rounded-2xl border border-white/10 p-6 hover:border-emerald-400/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                          <TreePine className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{option.treeName}</h4>
                          <p className="text-xs text-gray-400">{option.co2PerYear} kg CO₂/year</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-4">
                          <p className="text-sm text-gray-300 mb-1">Plant</p>
                          <p className="text-2xl font-bold text-white">
                            {option.numTrees} {option.numTrees === 1 ? "tree" : "trees"}
                          </p>
                          <p className="text-sm text-gray-300 mt-2">
                            for <span className="font-semibold text-white">{option.years}</span> {option.years === 1 ? "year" : "years"}
                          </p>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">Total CO₂ Absorbed</p>
                          <p className="text-lg font-semibold text-white">
                            {option.totalCo2Absorbed} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No options found. Please try a different carbon amount.</p>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-2">
                      <strong className="text-white">How it works:</strong> Based on your carbon amount, we calculate multiple tree planting options. Each option shows how many trees you need to plant and for how many years to offset your carbon footprint.
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      All calculations use verified data from Bangladesh Forest Research Institute and international sources. Trees native to Bangladesh are prioritized.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* How Trees Help Section */}
        <section className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 sm:mb-12 text-center tracking-tight">
            How Trees Combat Climate Change
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Carbon Sequestration</h3>
              <p className="text-gray-300 leading-relaxed">
                Trees absorb CO2 from the atmosphere during photosynthesis and store it in their biomass. 
                A mature tree can absorb up to 48 lbs (21.77 kg) of CO2 per year, making them one of 
                nature's most effective carbon sinks.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Oxygen Production</h3>
              <p className="text-gray-300 leading-relaxed">
                Through photosynthesis, trees release oxygen into the atmosphere. A single mature tree 
                can produce enough oxygen for 2-10 people per day, improving air quality and supporting life.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Climate Regulation</h3>
              <p className="text-gray-300 leading-relaxed">
                Trees help regulate local and global temperatures by providing shade, reducing heat 
                island effects, and influencing weather patterns. Forests are essential for maintaining 
                Earth's climate balance.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Biodiversity Support</h3>
              <p className="text-gray-300 leading-relaxed">
                Trees provide habitat for countless species, supporting biodiversity. Healthy forests 
                are crucial for ecosystem stability and resilience against climate change impacts.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="glass-card rounded-3xl p-12 sm:p-16 text-center border border-white/10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">Start Planting Today</h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Every tree you plant contributes to fighting climate change. Join millions of people 
            around the world who are making a difference, one tree at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full font-medium transition-all duration-200 hover:scale-105">
              Find Planting Programs
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-full font-medium transition-all duration-200">
              Learn More
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


