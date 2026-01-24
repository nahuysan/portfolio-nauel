import { ExternalLink, Github, FolderCode, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

export function Projects() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].projects;

  const projectList = [
    {
      id: "inBloom",
      image: "/projects/inbloom.png",
      tags: ["WordPress", "WooCommerce", "PHP"],
      link: "https://inbloomstore.com.ar",
      size: "md:col-span-2 md:row-span-2"
    },
    {
      id: "corchazo",
      image: "/projects/corcho.png",
      tags: ["WordPress", "WooCommerce", "PHP"],
      link: "https://corchazo.com.ar",
      size: "md:col-span-2"
    },
    {
      id: "wappa",
      image: "/projects/wappa.png",
      tags: ["WordPress", "WooCommerce", "PHP"],
      link: "https://wapperia.com",
      size: "md:col-span-1"
    },
    {
      id: "python", // Este es el de la distribuidora
      image: "/projects/mauri.png",
      tags: ["React", "TypeScript", "Tailwind CSS"],
      link: "https://dm-catalog.vercel.app/",
      github: "https://github.com/NahuySan/dm-catalog",
      size: "md:col-span-1"
    }
  ];

  return (
    <section id="projects" className="py-24 bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            {/* Usamos split para dar el efecto de glow solo a la segunda palabra si quieres */}
            {lang === 'es' ? 'Proyectos ' : 'Featured '} 
            <span className="text-primary text-glow">
              {lang === 'es' ? 'Destacados' : 'Projects'}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            {lang === 'es' 
              ? "Una fusión entre desarrollo de software riguroso y estética visual refinada." 
              : "A fusion between rigorous software development and refined visual aesthetics."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {projectList.map((project, index) => {
            // Buscamos la traducción específica del item usando su ID
            const itemT = t.items[project.id as keyof typeof t.items];

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={project.id}
                className={`${project.size} group relative bg-card border border-border/40 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]`}
              >
                {/* Imagen con zoom */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={project.image}
                    alt={itemT.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
                </div>

                {/* Contenido */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div className="mb-4 flex items-center gap-2">
                    {project.tags.includes("Photography") ? <Camera className="text-primary" size={20} /> : <FolderCode className="text-primary" size={20} />}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tIndex) => (
                        <span key={tIndex} className="text-[10px] uppercase tracking-widest font-bold text-primary/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {itemT.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2 group-hover:line-clamp-none transition-all">
                    {itemT.description}
                  </p>

                  <div className="flex gap-5">
                    {project.link && project.link !== "#" && (
                      <a href={project.link} className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors">
                        <ExternalLink size={14} /> {t.explore}
                      </a>
                    )}
                    {project.github && project.github !== "#" && (
                      <a href={project.github} className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors">
                        <Github size={14} /> {t.repo}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}