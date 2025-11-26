import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, TrendingDown, Users } from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Empowering change,
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                one footprint at a time
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Our mission is to make carbon tracking accessible, intuitive, and impactful.
              We believe that understanding your environmental impact is the first step
              toward creating meaningful change.
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Through advanced tracking, personalized insights, and actionable suggestions,
              we help individuals and communities reduce their carbon footprint and build
              a more sustainable future.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-emerald-400 mb-2">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-teal-400 mb-2">500K+</div>
                <div className="text-sm text-gray-400">CO₂ Tracked</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">25%</div>
                <div className="text-sm text-gray-400">Avg Reduction</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Glassmorphic Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="glass-card rounded-2xl p-6 border border-white/10"
              >
                <Globe className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Global Impact</h3>
                <p className="text-gray-300">
                  Join thousands of users making a difference worldwide
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="glass-card rounded-2xl p-6 border border-white/10"
              >
                <TrendingDown className="w-12 h-12 text-teal-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Real Results</h3>
                <p className="text-gray-300">
                  Track your progress and see measurable reductions
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="glass-card rounded-2xl p-6 border border-white/10"
              >
                <Users className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
                <p className="text-gray-300">
                  Connect with like-minded individuals on the same journey
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}











