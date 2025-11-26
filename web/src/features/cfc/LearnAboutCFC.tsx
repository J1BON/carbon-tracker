import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Info, AlertTriangle, Shield, Lightbulb, ArrowRight, Wind, Refrigerator } from "lucide-react";
import { motion } from "framer-motion";

export default function LearnAboutCFC() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex flex-col pt-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Learn About CFCs</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Understanding Chlorofluorocarbons and their impact on our environment
            </p>
          </div>

          {/* What are CFCs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass-card rounded-2xl border border-white/10 mb-8 shadow-xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                    <Info className="w-7 h-7 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">What are CFCs?</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed text-lg">
                  <strong className="text-white">Chlorofluorocarbons (CFCs)</strong> are synthetic compounds that were widely used
                  in refrigeration, air conditioning, aerosol propellants, and foam-blowing agents. They
                  consist of carbon, chlorine, and fluorine atoms.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  CFCs were popular because they are non-toxic, non-flammable, and stable. However, their
                  stability is also what makes them harmful to the environment.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why They Are Harmful */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl border border-white/10 mb-8 shadow-xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Why They Are Harmful</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-red-500/10 border border-red-400/20 rounded-2xl border-l-4 border-l-red-500">
                    <h3 className="font-bold text-red-400 mb-2 text-lg">Ozone Layer Depletion</h3>
                    <p className="text-gray-300 leading-relaxed">
                      CFCs break down in the stratosphere, releasing chlorine atoms that destroy ozone
                      molecules. One chlorine atom can destroy thousands of ozone molecules, leading to
                      the formation of the ozone hole.
                    </p>
                  </div>
                  <div className="p-6 bg-red-500/10 border border-red-400/20 rounded-2xl border-l-4 border-l-red-500">
                    <h3 className="font-bold text-red-400 mb-2 text-lg">Greenhouse Effect</h3>
                    <p className="text-gray-300 leading-relaxed">
                      CFCs are potent greenhouse gases with a global warming potential thousands of times
                      greater than carbon dioxide. They contribute significantly to climate change.
                    </p>
                  </div>
                  <div className="p-6 bg-red-500/10 border border-red-400/20 rounded-2xl border-l-4 border-l-red-500">
                    <h3 className="font-bold text-red-400 mb-2 text-lg">Long Atmospheric Lifetime</h3>
                    <p className="text-gray-300 leading-relaxed">
                      CFCs can remain in the atmosphere for 50-100 years, causing long-term environmental
                      damage even after production stops.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Safe Alternatives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-card rounded-2xl border border-white/10 mb-8 shadow-xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Safe Alternatives</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl">
                    <h3 className="font-bold text-lg text-emerald-400 mb-2">R-600a (Isobutane)</h3>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      Natural hydrocarbon refrigerant with zero ozone depletion potential (ODP) and very
                      low global warming potential (GWP).
                    </p>
                    <div className="space-y-1">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/20">ODP: 0</span>
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full ml-2 border border-emerald-400/20">GWP: 3</span>
                      <span className="block px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full mt-2 border border-emerald-400/20">Used in modern refrigerators</span>
                    </div>
                  </div>
                  <div className="p-6 bg-teal-500/10 border border-teal-400/20 rounded-2xl">
                    <h3 className="font-bold text-lg text-teal-400 mb-2">R-290 (Propane)</h3>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      Natural hydrocarbon refrigerant that's environmentally friendly and energy-efficient.
                    </p>
                    <div className="space-y-1">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-teal-500/20 text-teal-300 rounded-full border border-teal-400/20">ODP: 0</span>
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-teal-500/20 text-teal-300 rounded-full ml-2 border border-teal-400/20">GWP: 3</span>
                      <span className="block px-3 py-1 text-xs font-semibold bg-teal-500/20 text-teal-300 rounded-full mt-2 border border-teal-400/20">Used in air conditioning systems</span>
                    </div>
                  </div>
                  <div className="p-6 bg-cyan-500/10 border border-cyan-400/20 rounded-2xl">
                    <h3 className="font-bold text-lg text-cyan-400 mb-2">R-134a (HFC)</h3>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                      Hydrofluorocarbon that replaced CFCs. Better than CFCs but still has high GWP.
                      Transitioning to natural alternatives.
                    </p>
                    <div className="space-y-1">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/20">ODP: 0</span>
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full ml-2 border border-yellow-400/20">GWP: 1,430</span>
                      <span className="block px-3 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 rounded-full mt-2 border border-blue-400/20">Temporary transition refrigerant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How to Avoid CFC Emissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass-card rounded-2xl border border-white/10 mb-8 shadow-xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                    <Lightbulb className="w-7 h-7 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">How to Avoid CFC Emissions</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Choose Modern Appliances",
                      description: "When buying new AC units or refrigerators, look for models that use R-600a or R-290 refrigerants. These are marked as \"CFC-free\" or \"eco-friendly.\"",
                    },
                    {
                      title: "Proper Maintenance",
                      description: "Regular servicing of your AC and refrigerator can prevent leaks. Have certified technicians check for leaks and repair them promptly.",
                    },
                    {
                      title: "Proper Disposal",
                      description: "When disposing of old appliances, ensure they are handled by certified recycling facilities that can safely extract and destroy CFCs without releasing them into the atmosphere.",
                    },
                    {
                      title: "Report Leaks",
                      description: "If you suspect a CFC leak from your appliance, report it immediately. Quick action can prevent significant environmental damage.",
                    },
                    {
                      title: "Energy Efficiency",
                      description: "Use energy-efficient appliances that consume less power, reducing overall environmental impact.",
                    },
                  ].map((tip, index) => (
                    <div key={index} className="p-6 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
                      <h3 className="font-bold text-lg text-blue-400 mb-2">
                        {index + 1}. {tip.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="glass-card rounded-2xl border border-white/10 shadow-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Ready to Make a Difference?</h2>
                    <p className="text-gray-300 text-lg">
                      Report CFC issues and help us track and reduce harmful emissions
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Link to="/cfc/report">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
                      >
                        Report CFC Issue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/cfc/my-reports">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-white/20 text-white hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
                      >
                        View My Reports
                      </Button>
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
