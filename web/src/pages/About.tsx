import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Target, Leaf, Award, Globe, TrendingDown } from "lucide-react";

export default function About() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const featuresRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Target,
      title: "Accuracy",
      description: "We provide precise carbon calculations based on verified emission factors and scientific data.",
      color: "emerald",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Our platform is designed to be user-friendly and accessible to everyone, regardless of technical expertise.",
      color: "teal",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We are committed to promoting sustainable practices and environmental consciousness in all aspects of our platform.",
      color: "cyan",
    },
    {
      icon: Award,
      title: "Innovation",
      description: "We continuously innovate with gamification, AI-powered insights, and cutting-edge technology to enhance user engagement.",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
      <Navbar />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-4"
          >
            About MyCarbonFootprint
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Empowering individuals to understand and reduce their carbon footprint through 
            innovative measurement, gamification, and sustainable practices.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24 space-y-16 sm:space-y-24 md:space-y-32">
        {/* Mission Section */}
        <section 
          ref={missionRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              At MyCarbonFootprint, we believe that every individual action matters in the fight against 
              climate change. Our mission is to make carbon footprint measurement accessible, engaging, 
              and actionable for everyone.
            </p>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Through our comprehensive tracking tools, gamification features, and educational 
              resources, we help users understand their environmental impact and take meaningful 
              steps toward a more sustainable future.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We envision a world where carbon consciousness is integrated into daily life, 
              where individuals are empowered with knowledge and tools to make a positive 
              difference for our planet.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <Globe className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Global Impact</h3>
              <p className="text-gray-300">
                Join thousands of users making a difference worldwide
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <TrendingDown className="w-12 h-12 text-teal-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Real Results</h3>
              <p className="text-gray-300">
                Track your progress and see measurable reductions
              </p>
            </div>
          </motion.div>
        </section>

        {/* Values Section */}
        <section 
          ref={valuesRef}
          className="space-y-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center tracking-tight"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              const colorClasses = {
                emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
                teal: "text-teal-400 bg-teal-400/10 border-teal-400/20",
                cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
                purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
              };
              const colorClass = colorClasses[value.color as keyof typeof colorClasses];

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="glass-card rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-xl ${colorClass} flex items-center justify-center mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section 
          ref={featuresRef}
          className="glass-card rounded-3xl p-12 border border-white/10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center mb-12 tracking-tight"
          >
            What We Offer
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Carbon Measurement</h3>
              <p className="text-gray-300 leading-relaxed">
                Comprehensive measurement of your carbon footprint across transport, diet, energy, 
                shopping, and lifestyle activities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Gamification</h3>
              <p className="text-gray-300 leading-relaxed">
                Earn points, level up, and compete on leaderboards to make sustainability fun 
                and engaging.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌳</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Tree Planting</h3>
              <p className="text-gray-300 leading-relaxed">
                Calculate your impact and learn how planting trees contributes to carbon 
                reduction and climate change mitigation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who are already measuring their carbon footprint and 
              making a positive impact on the environment.
            </p>
            <Link to="/">
              <Button className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300">
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
