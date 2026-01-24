import { Code2, Camera, Cpu } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

export function About() {
  const { lang } = useLanguage();
  
  // Acceso seguro a las traducciones de esta sección
  const t = translations[lang as keyof typeof translations].about;

  // Mantenemos los íconos en orden para que coincidan con el array de skills en el JSON
  const skillIcons = [
    <Code2 size={40} key="dev" />,
    <Cpu size={40} key="auto" />,
    <Camera size={40} key="design" />
  ];

  return (
    <section id="about" className="py-24 bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-6">
        {/* Cabecera de la sección */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">
            {t.title}<span className="text-primary text-glow">{t.titleHighlight}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Grilla de Habilidades */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t.skills.map((skill, index) => (
            <div
              key={index}
              className="group p-10 bg-card border border-border/50 rounded-2xl hover:border-primary/50 hover:bg-accent/5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decoración de fondo de la card */}
              <div className="absolute -right-4 -top-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                {skillIcons[index]}
              </div>

              <div className="mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                {skillIcons[index]}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                {skill.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}