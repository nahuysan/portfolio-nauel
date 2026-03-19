import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LanguageProvider } from './context/LanguageContext';
import { LiquidHero } from "./components/LiquidHero";
import { MobileHero } from "./components/MobileHero"; 
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Photography } from "./components/Photography";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Cambiamos 768 por 1024 para incluir tablets en la vista Mobile
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <LanguageProvider>

        <Analytics />
        <SpeedInsights />

      <div className="size-full">
        <Header />
        <main>
          {/* Ahora isMobile será true para celulares y la mayoría de las tablets */}
          {isMobile ? <MobileHero /> : <LiquidHero />}
          
          <About />
          <Projects />
          <Photography />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}