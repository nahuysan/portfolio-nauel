import { Code2, Camera, Cpu } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";
import { motion } from "framer-motion";

export function About() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].about;

  const skillIcons = [
    <Code2 size={40} key="dev" />,
    <Cpu size={40} key="auto" />,
    <Camera size={40} key="design" />
  ];

  return (
    <section id="about" className="py-24 bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-6">
        
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tighter">
            {t.title}<span className="text-primary text-glow">{t.titleHighlight}</span>
          </h2>
          <p className="text-md lg:text-xl text-muted-foreground leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Cambiamos md:grid-cols-3 por lg:grid-cols-3 */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t.skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-10 bg-card border border-border/50 rounded-3xl 
                         hover:border-primary/50 transition-all duration-500 
                         overflow-hidden shadow-2xl"
            >
              {/* 1. BACK GLOW PERSISTENTE: Ahora hasta LG (1024px) se ve siempre */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/15 blur-[80px] rounded-full pointer-events-none opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* 2. GLOW DETRÁS DEL ICONO */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

              {/* Decoración de fondo */}
              <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/20 group-hover:blur-[1px] transition-all duration-500">
                {skillIcons[index]}
              </div>

              {/* Contenido de la Card */}
              <div className="relative z-10">
                {/* Icono con brillo: Comportamiento mobile/tablet hasta LG */}
                <div className="mb-6 text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] lg:drop-shadow-none lg:group-hover:drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] group-hover:scale-110 transition-all duration-300">
                  {skillIcons[index]}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {skill.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                  {skill.description}
                </p>
              </div>

              {/* Borde inferior estético */}
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-linear-to-r from-transparent via-primary/20 to-transparent lg:via-transparent lg:group-hover:via-primary transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}