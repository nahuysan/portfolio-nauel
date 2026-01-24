import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

export function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background text-foreground pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-center">
          
          {/* Logo y Eslogan con tu Verde Tech */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold tracking-tighter mb-4">
              NAHUEL<span className="text-primary">.</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">
              {t.text}
            </p>
          </div>

          {/* Redes Sociales usando el color Accent/Primary */}
          <div className="flex justify-center gap-6">
            <a 
              href="https://github.com/tu-usuario" 
              target="_blank" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Github size={22} />
            </a>
            <a 
              href="https://linkedin.com/in/tu-perfil" 
              target="_blank" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Linkedin size={22} />
            </a>
            <a 
              href="https://instagram.com/tu-cuenta" 
              target="_blank" 
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Instagram size={22} />
            </a>
          </div>

          {/* Botón Volver Arriba con interacción Tech */}
          <div className="flex justify-center md:justify-end">
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-all duration-300"
            >
              {lang === 'es' ? 'VOLVER ARRIBA' : 'BACK TO TOP'}
              <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Línea Divisoria y Stack Tecnológico */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] font-bold text-muted-foreground/50 uppercase">
          <p>© 2026 — {t.rights}</p>
          <div className="flex gap-8">
            <span className="hover:text-primary/70 transition-colors">TypeScript</span>
            <span className="hover:text-primary/70 transition-colors">React</span>
            <span className="hover:text-primary/70 transition-colors">Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}