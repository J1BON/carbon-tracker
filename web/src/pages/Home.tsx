import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ReportSubmissionSection from "@/components/sections/ReportSubmissionSection";
import SuggestionsSection from "@/components/sections/SuggestionsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ReportSubmissionSection />
        <SuggestionsSection />
      </main>
      <Footer />
    </div>
  );
}













