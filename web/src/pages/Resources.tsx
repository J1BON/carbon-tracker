import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Video, ExternalLink, Download, Info, CheckCircle } from "lucide-react";

export default function Resources() {
  const heroRef = useRef(null);
  const resourcesRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const resourcesInView = useInView(resourcesRef, { once: true, margin: "-100px" });

  const resources = [
    {
      category: "Guides",
      icon: BookOpen,
      items: [
        { 
          id: "understanding-carbon-footprint",
          title: "Understanding Your Carbon Footprint", 
          description: "Comprehensive guide explaining what a carbon footprint is, how it's calculated, and why it matters for climate change.",
          link: "#",
          author: "Carbon Tracker Team",
          date: "2024-01-15"
        },
        { 
          id: "reduce-emissions",
          title: "How to Reduce Your Emissions", 
          description: "Practical, actionable tips for lowering your carbon footprint. From transportation to diet choices.",
          link: "#",
          author: "Sarah Johnson",
          date: "2024-01-12"
        },
        { 
          id: "transportation-alternatives",
          title: "Transportation Alternatives", 
          description: "Explore eco-friendly transportation options and their carbon impact. Compare cars, trains, buses, bikes.",
          link: "#",
          author: "Emily Rodriguez",
          date: "2024-01-10"
        },
        { 
          id: "sustainable-diet-guide",
          title: "Sustainable Diet Guide", 
          description: "Learn how your food choices impact the environment. Discover the carbon footprint of different foods.",
          link: "#",
          author: "David Kim",
          date: "2024-01-08"
        },
        {
          id: "tree-planting-guide",
          title: "Tree Planting Guide",
          description: "Complete guide to tree planting for carbon offset. Learn which trees are most effective.",
          link: "/tree-planting",
          author: "Lisa Anderson",
          date: "2024-01-20"
        },
      ]
    },
    {
      category: "Reports",
      icon: FileText,
      items: [
        { 
          id: "climate-change-report-2024",
          title: "Climate Change Report 2024", 
          description: "Latest research on climate change impacts, trends, and projections. Based on IPCC and UN data.",
          link: "#",
          author: "UN Environment Programme",
          date: "2024-01-15"
        },
        { 
          id: "carbon-emission-statistics",
          title: "Carbon Emission Statistics", 
          description: "Global and regional emission data from EPA, IEA, and other authoritative sources.",
          link: "#",
          author: "EPA & IEA",
          date: "2024-01-12"
        },
        { 
          id: "forest-carbon-sequestration",
          title: "Forest Carbon Sequestration Study", 
          description: "Research on how forests absorb CO2 and their potential for climate mitigation.",
          link: "#",
          author: "Arbor Day Foundation",
          date: "2024-01-18"
        },
        {
          id: "renewable-energy-impact",
          title: "Renewable Energy Impact Report",
          description: "Analysis of renewable energy sources and their carbon reduction potential.",
          link: "#",
          author: "IEA",
          date: "2024-01-16"
        },
      ]
    },
    {
      category: "Videos",
      icon: Video,
      items: [
        { 
          id: "carbon-tracking-tutorial",
          title: "Introduction to Carbon Tracking", 
          description: "Watch our tutorial series on how to track your carbon footprint. Step-by-step guides.",
          link: "#",
          author: "Carbon Tracker Team",
          date: "2024-01-15"
        },
        { 
          id: "success-stories",
          title: "Success Stories", 
          description: "Inspiring stories from users who have successfully reduced their carbon footprint.",
          link: "#",
          author: "Community",
          date: "2024-01-12"
        },
        { 
          id: "expert-interviews",
          title: "Expert Interviews", 
          description: "Insights from climate scientists, environmental experts, and sustainability leaders.",
          link: "#",
          author: "Various Experts",
          date: "2024-01-10"
        },
        {
          id: "tree-planting-tutorial",
          title: "Tree Planting Tutorial",
          description: "Learn how to plant trees effectively for carbon offset. Video guide covering techniques.",
          link: "#",
          author: "Arbor Day Foundation",
          date: "2024-01-20"
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
      <Navbar />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative py-32 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Resources & Learning
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our comprehensive collection of guides, reports, and videos 
            to help you understand and reduce your carbon footprint.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main 
        ref={resourcesRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-32 flex-1"
      >
        {/* Resources by Category */}
        {resources.map((category, catIndex) => {
          const IconComponent = category.icon;
          return (
            <motion.section
              key={catIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={resourcesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: catIndex * 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8 sm:mb-12">
                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">{category.category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={resourcesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: catIndex * 0.2 + itemIndex * 0.1 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="p-6 bg-white/5 backdrop-blur-lg">
                      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">{item.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-white/10">
                        <span>{item.author}</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      {item.link && item.link.startsWith("/") ? (
                        <Link to={item.link}>
                          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                            Learn More <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/resources/${item.id || item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                            Learn More <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}

        {/* Key Information Cards */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-3xl p-12 border border-white/10"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-12 text-center tracking-tight">
            Key Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-semibold text-white">Data Sources</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our emission factors and calculations are based on data from:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>EPA (U.S. Environmental Protection Agency)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>IPCC (Intergovernmental Panel on Climate Change)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>UN Environment Programme</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Arbor Day Foundation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Our World in Data</span>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-teal-400" />
                <h3 className="text-xl font-semibold text-white">Reliability</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                All data and calculations are verified and sourced from internationally recognized organizations:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Peer-reviewed scientific sources</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Government environmental agencies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>International climate organizations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Regularly updated emission factors</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Download Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-3xl p-12 border border-white/10"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-12 text-center tracking-tight">Downloads</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="glass-card rounded-2xl p-6 border border-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Quick Start Guide</h3>
                  <p className="text-sm text-gray-400 mb-3">PDF • 2.5 MB</p>
                  <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-gray-300 rounded-full">
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="glass-card rounded-2xl p-6 border border-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Emission Factors</h3>
                  <p className="text-sm text-gray-400 mb-3">PDF • 1.8 MB</p>
                  <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-gray-300 rounded-full">
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -8 }}
              className="glass-card rounded-2xl p-6 border border-white/10 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Sustainability Tips</h3>
                  <p className="text-sm text-gray-400 mb-3">PDF • 3.2 MB</p>
                  <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/5 text-gray-300 rounded-full">
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
