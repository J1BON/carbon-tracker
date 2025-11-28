import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, Award, Lightbulb, Target } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "CFC Tracking",
    description: "Monitor your chlorofluorocarbon emissions and understand their environmental impact.",
    color: "emerald",
  },
  {
    icon: Award,
    title: "Carbon Score",
    description: "Get a personalized eco-score that reflects your environmental footprint and progress.",
    color: "teal",
  },
  {
    icon: Lightbulb,
    title: "Eco Tips",
    description: "Receive intelligent suggestions tailored to your lifestyle to reduce your carbon footprint.",
    color: "cyan",
  },
  {
    icon: Target,
    title: "Sustainability Goals",
    description: "Set and track personalized sustainability goals with actionable milestones.",
    color: "purple",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Powerful features for
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              sustainable living
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to understand, track, and reduce your carbon footprint
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const colorClasses = {
              emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
              teal: "text-teal-400 bg-teal-400/10 border-teal-400/20",
              cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
              purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
            };
            const colorClass = colorClasses[feature.color as keyof typeof colorClasses];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="glass-card rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-xl ${colorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}













