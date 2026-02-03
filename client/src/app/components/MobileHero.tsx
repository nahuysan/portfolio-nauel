import { motion, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

export function MobileHero() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].hero;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden px-6 md:px-20 pt-24 pb-12">
      
      {/* 1. RETRATO SUPERIOR */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-10 md:mb-14"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          // Agrandamos un poco el retrato en tablet (md:w-56)
          className="relative w-44 h-44 md:w-56 md:h-56 rounded-full p-1 bg-linear-to-tr from-primary/50 to-transparent shadow-[0_0_40px_rgba(34,197,94,0.2)]"
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-900 bg-slate-900">
            <img 
              src="/heroMobile.png" 
              alt="Nahuel Sanchez" 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </motion.div>
        
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl -z-10 animate-pulse" />
      </motion.div>

      {/* 2. CONTENIDO UI */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 text-center w-full"
      >
        <motion.h1 
          variants={itemVariants}
          // Subimos el tamaño en tablet (md:text-7xl) para que llene más el eje X
          className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tighter leading-[1.1]"
        >
          {t.titlePart1} <br />
          {t.titlePart2}<span className="text-primary"> & </span>{t.titlePart3}
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          // Acá está el cambio clave: md:max-w-xl para que el texto se estire
          className="text-gray-400 text-sm md:text-lg mb-10 max-w-[280px] md:max-w-2xl mx-auto leading-relaxed"
        >
          {t.subtitle}
        </motion.p>

        {/* Contenedor de botones: md:flex-row para que no queden tan largos y finitos en tablet */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center md:max-w-lg mx-auto">
          <button 
            onClick={() => scrollToSection("projects")}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-[0_10px_20px_rgba(34,197,94,0.2)] active:scale-95 transition-transform"
          >
            {t.btnProjects}
          </button>
          <button 
            onClick={() => scrollToSection("contact")}
            className="w-full py-4 border border-white/10 text-white rounded-2xl font-semibold backdrop-blur-md active:scale-95 transition-transform"
          >
            {t.btnContact}
          </button>
        </motion.div>
      </motion.div>

      {/* 3. INDICADOR DE SCROLL */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={() => scrollToSection("about")}
        className="mt-12 md:mt-20 p-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={28} className="text-white/20 md:size-10" />
        </motion.div>
      </motion.button>
    </section>
  );
}