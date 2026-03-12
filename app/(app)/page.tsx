import Hero  from "@/components/Hero";
import Features  from "@/components/Features";
import Courses  from "@/components/Courses";
import HowItWorks  from "@/components/HowItWorks";
import Pricing  from "@/components/Pricing";
import Footer  from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans mt-32 selection:bg-primary/30">

      <Hero />
      <Features />
      <Courses />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
