import Header from '../components/home/Header';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      <div className="h-[3716px] self-stretch flex flex-col bg-white">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
}