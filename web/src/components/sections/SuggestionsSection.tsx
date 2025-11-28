import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sprout, Bike, Lightbulb, Recycle, Car, Home } from "lucide-react";

const suggestions = [
  {
    icon: Bike,
    emoji: "🚴",
    title: "Bike to Work",
    description: "Replace car commutes with cycling. Reduces emissions by up to 2.4 kg CO₂ per trip.",
    color: "emerald",
  },
  {
    icon: Sprout,
    emoji: "🌱",
    title: "Plant Trees",
    description: "Plant native trees in your area. Each tree absorbs approximately 22 kg CO₂ per year.",
    color: "teal",
  },
  {
    icon: Lightbulb,
    emoji: "💡",
    title: "Switch to LED",
    description: "Replace incandescent bulbs with LED lights. Saves 80% energy and lasts 25x longer.",
    color: "cyan",
  },
  {
    icon: Recycle,
    emoji: "♻️",
    title: "Recycle More",
    description: "Increase recycling rates. Properly recycling reduces landfill methane emissions.",
    color: "purple",
  },
  {
    icon: Car,
    emoji: "🚗",
    title: "Carpool",
    description: "Share rides with colleagues. Reduces emissions by 50% per person per trip.",
    color: "indigo",
  },
  {
    icon: Home,
    emoji: "🏠",
    title: "Energy Audit",
    description: "Conduct a home energy audit. Identify and fix energy leaks to reduce consumption.",
    color: "pink",
  },
];

export default function SuggestionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Personalized
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              eco suggestions
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get actionable tips tailored to your lifestyle to reduce your carbon footprint
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion, index) => {
            const IconComponent = suggestion.icon;
            const colorClasses = {
              emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
              teal: "text-teal-400 bg-teal-400/10 border-teal-400/20",
              cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
              purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
              indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
              pink: "text-pink-400 bg-pink-400/10 border-pink-400/20",
            };
            const colorClass = colorClasses[suggestion.color as keyof typeof colorClasses];

            return (
              <motion.div
                key={suggestion.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-4xl">{suggestion.emoji}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{suggestion.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{suggestion.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}













