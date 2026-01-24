import { Menu, X, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang as keyof typeof translations].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const sections = ["home", "about", "projects", "photography", "contact"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo con tu Verde Tech */}
        <div 
          className="text-xl font-bold tracking-tighter cursor-pointer text-foreground"
          onClick={() => scrollToSection("home")}
        >
          NAHUEL<span className="text-primary">.</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t[section as keyof typeof t]}
            </button>
          ))}

          {/* Botón Switch de Idioma Desktop */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
          >
            <Languages size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold tracking-widest text-foreground">
              {lang === 'es' ? 'EN' : 'ES'}
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl transition-all duration-300 border-b border-border ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col gap-4 p-6">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-left text-lg font-medium text-foreground/90 hover:text-primary py-2 border-b border-border/50"
            >
              {t[section as keyof typeof t]}
            </button>
          ))}
          
          {/* Switch de Idioma Mobile */}
          <button
            onClick={toggleLang}
            className="flex items-center justify-between mt-2 p-4 rounded-xl bg-accent/10 border border-border"
          >
            <div className="flex items-center gap-3">
              <Languages size={20} className="text-primary" />
              <span className="text-foreground font-medium">
                {lang === 'es' ? 'English Version' : 'Versión en Español'}
              </span>
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              {lang === 'es' ? 'EN' : 'ES'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}