import { Menu, X, Languages, FileText } from "lucide-react";
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
        {/* Logo */}
        <div 
          className="text-xl font-bold tracking-tighter cursor-pointer text-foreground"
          onClick={() => scrollToSection("home")}
        >
          NAHUEL<span className="text-primary">.</span>
        </div>

        {/* --- DESKTOP NAVIGATION (Ahora desde 1024px en adelante) --- */}
        <div className="hidden lg:flex items-center gap-8">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {t[section as keyof typeof t]}
            </button>
          ))}

          {/* Botón CV Desktop */}
          <a
            href={lang === 'es' ? '/cv-nahuel-es.pdf' : '/cv-nahuel-en.pdf'}
            download
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-300 group"
          >
            <FileText size={14} className="text-primary" />
            <span className="text-[10px] font-bold tracking-widest text-foreground">
              CV
            </span>
          </a>

          {/* Botón Idioma Desktop */}
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

        {/* --- ACTIONS PARA MÓVIL Y TABLET (Hasta 1023px) --- */}
        <div className="flex lg:hidden items-center gap-5">
          {/* Botón de Idioma: Visible en Mobile y Tablet */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/50 backdrop-blur-sm active:scale-90 transition-all"
          >
            <Languages size={16} className="text-primary" />
            <span className="text-xs font-bold text-foreground">
              {lang === 'es' ? 'EN' : 'ES'}
            </span>
          </button>

          {/* Botón Menú Hamburguesa */}
          <button
            className="text-foreground active:scale-90 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- DROPDOWN PARA MÓVIL Y TABLET --- */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl transition-all duration-300 border-b border-border ${
          isMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="flex flex-col gap-4 p-6">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-left text-lg font-medium text-foreground/90 hover:text-primary py-3 border-b border-border/50 transition-colors"
            >
              {t[section as keyof typeof t]}
            </button>
          ))}

          <a
            href={lang === 'es' ? '/cv-nahuel-es.pdf' : '/cv-nahuel-en.pdf'}
            download
            className="flex items-center justify-between text-lg font-medium text-primary py-3 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>{lang === 'es' ? 'Descargar CV' : 'Download CV'}</span>
            <FileText size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}