import { ArrowDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

export function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].hero;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center md:justify-start bg-slate-950 overflow-hidden pt-16"
    >
      {/* 1. Videos de fondo */}
      <video autoPlay muted playsInline className="hidden md:block absolute inset-0 w-full h-full object-cover z-0">
        <source src="/hero-desktop.mp4" type="video/mp4" />
      </video>
      <video autoPlay muted playsInline className="block md:hidden absolute inset-0 w-full h-full object-cover z-0">
        <source src="/hero-mobile.mp4" type="video/mp4" />
      </video>

      {/* 2. Máscaras de legibilidad */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent z-10" />

      <div className="container relative z-20 mx-auto px-6 md:px-24">
        <div className="max-w-4xl text-center md:text-left">
          <h1 className="text-5xl md:text-8xl mb-10 font-bold text-foreground tracking-tighter">
            {t.titlePart1} <br className="hidden md:block" /> 
            {t.titlePart2} <span className="text-primary">&</span> {t.titlePart3}
          </h1>
          
          {/* LA BAJADA / SUBTÍTULO */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
            <button 
              onClick={() => scrollToSection("projects")}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-all font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              {t.btnProjects}
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="px-10 py-4 border-2 border-primary/30 text-primary rounded-full hover:bg-primary/10 transition-all font-semibold backdrop-blur-sm"
            >
              {t.btnContact}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-30 cursor-pointer p-2"
      >
        <ArrowDown size={32} className="text-white/50 hover:text-white transition-colors" />
      </button>
    </section>
  );
}