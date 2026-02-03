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
    <footer className="relative bg-background text-foreground pt-20 pb-10 border-t border-border overflow-hidden">
      
      {/* GLOW ESTÉTICO: Esquina inferior izquierda para cerrar el diseño */}
      <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-start">
          
          {/* 1. Branding y Propósito */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold tracking-tighter mb-4">
              NAHUEL<span className="text-primary">.</span>
              <span className="block text-[10px] tracking-[0.3em] text-muted-foreground font-medium mt-1 uppercase">
                Dev & Photography
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0 leading-relaxed italic">
              "{t.text}"
            </p>
          </div>

          {/* 2. Conectividad (Links Reales) */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground uppercase">Social</div>
            <div className="flex gap-8">
              <a 
                href="https://github.com/NahuySan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://linkedin.com/in/nahuelsan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://instagram.com/nahuelssanchez" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* 3. Navegación Rápida */}
          <div className="flex justify-center md:justify-end">
            <button 
              onClick={scrollToTop}
              className="group flex flex-col items-center md:items-end gap-3 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-all duration-300"
            >
              <div className="p-3 border border-border rounded-full group-hover:border-primary/50 group-hover:-translate-y-2 transition-all">
                <ArrowUp size={18} />
              </div>
              {lang === 'es' ? 'VOLVER ARRIBA' : 'BACK TO TOP'}
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.2em] font-bold text-muted-foreground/40 uppercase">
          <p>© 2026 — {t.rights}</p>
          
          <div className="flex items-center gap-6">
            {/* Link directo al Repo */}
            <a 
              href="https://github.com/NahuySan/portfolio-nauel" // Cambialo por tu ruta real
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-all flex items-center gap-2 border border-border/50 px-3 py-1 rounded-full hover:border-primary/50"
            >
              <Github size={10} />
              {lang === 'es' ? 'Código Fuente' : 'Source Code'}
            </a>

            <div className="flex gap-4">
              <span className="hover:text-primary/60 transition-colors">React</span>
              <span className="text-border">/</span>
              <span className="hover:text-primary/60 transition-colors">TypeScript</span>
              <span className="text-border">/</span>
              <span className="hover:text-primary/60 transition-colors">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}