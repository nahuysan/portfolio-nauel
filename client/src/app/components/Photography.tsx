import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";
import photoData from "../../data/photos.json";
import { ImageWithFallback } from "./ui/ImageWithFallback";

interface Photo {
  webp: string;
  original: string;
  category: string;
  orientation: 'portrait' | 'landscape';
}

const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function Photography() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].photography;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const featuredPhotos = photoData.reduce((acc: Photo[], current: any) => {
    if (!acc.find((p) => p.category === current.category)) {
      acc.push(current as Photo);
    }
    return acc;
  }, []);

  const shuffledCategoryPhotos = useMemo(() => {
    if (!selectedCategory) return [];
    const filtered = photoData
      .filter((p: any) => p.category === selectedCategory)
      .map((p: any) => ({
        ...p,
        orientation: p.orientation || 'landscape'
      })) as Photo[];
    return shuffleArray(filtered);
  }, [selectedCategory]);

  const handleCardClick = (category: string) => {
    if (activeCard === category) {
      setSelectedCategory(category);
    } else {
      setActiveCard(category);
    }
  };

  return (
    <section 
      id="photography" 
      className="relative w-full overflow-hidden bg-background h-auto md:h-400" 
      onClick={() => setActiveCard(null)}
    >
      
      {/* 1. BACKGROUND IMAGE */}
      <motion.div 
        className="relative md:absolute md:inset-0 z-0"
        animate={{ 
          filter: activeCard ? "blur(8px) brightness(0.6)" : "blur(0px) brightness(1)",
          scale: activeCard ? 1.05 : 1
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <ImageWithFallback
          src="/photography/Paisaje/10.webp"
          alt="Background"
          className="w-full h-auto md:h-full md:object-cover md:object-bottom opacity-70" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </motion.div>

      {/* 2. CAPA DE CONTENIDO: Ajustado pt-4 para Mobile */}
      <div className="absolute inset-0 md:relative z-10 flex flex-col items-center justify-start px-6 pt-4 md:pt-50"> 

        {/* Header: Ajustado mb-2 para Mobile */}
        <div className="max-w-3xl md:max-w-6xl w-full text-center mb-2 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-bold mb-2 md:mb-4 tracking-tighter"
          >
            {t.title}<span className="text-primary text-glow">{t.titleHighlight}</span>
          </motion.h2>
          
          <p className="text-[10px] md:text-xl text-muted-foreground italic leading-relaxed px-4 md:pt-5 md:px-20 opacity-80">
            {t.subtitle}
          </p>
        </div>

        {/* INTERFAZ DE ABANICO: Pegado más al título en mobile */}
        <div className="relative w-full max-w-5xl md:max-w-7xl h-[220px] md:h-[500px] flex items-center justify-center mt-4 md:mt-2">
          {featuredPhotos.map((photo, index) => {
            const total = featuredPhotos.length;
            const angleFactor = isMobile ? 15 : 19;
            const rotation = (index - (total - 1) / 2) * angleFactor; 
            const isActive = activeCard === photo.category;

            return (
              <motion.div
                key={photo.category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                animate={{
                  y: isActive ? (isMobile ? -30 : -80) : 0, 
                  rotate: isActive ? 0 : rotation,
                  scale: isActive ? 1.05 : 1,
                  zIndex: isActive ? 50 : index,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute w-[160px] md:w-[320px] cursor-pointer origin-bottom"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(photo.category);
                }}
              >
                <div className={`relative bg-muted/10 backdrop-blur-sm p-1.5 md:p-2 rounded-2xl border transition-all duration-500 overflow-hidden
                  ${isActive ? 'border-primary/50 shadow-[0_0_40px_rgba(var(--primary),0.15)]' : 'border-white/10 shadow-2xl'}
                `}>
                  <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                    <picture className="w-full h-full">
                      <source srcSet={photo.webp} type="image/webp" />
                      <ImageWithFallback
                        src={photo.original}
                        alt={photo.category}
                        className="w-full h-full object-cover"
                      />
                    </picture>

                    <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/10 to-transparent flex flex-col justify-start p-3 md:p-5">
                      <h3 className="text-white text-xs md:text-xl font-bold tracking-tighter leading-none mb-1">
                        {photo.category}
                      </h3>
                      <p className={`text-primary font-bold tracking-[0.2em] uppercase text-[6px] md:text-[8px] transition-opacity duration-500
                        ${isActive ? 'opacity-100' : 'opacity-0'}
                      `}>
                        {t.viewGallery}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. MODAL GALLERY */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedCategory(null)}
          >
            <div className="w-full max-w-7xl h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">{selectedCategory}</h2>
                <button
                  className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-full transition-all border border-white/10"
                  onClick={() => setSelectedCategory(null)}
                >
                  <X size={32} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-dense gap-4 pb-20">
                  {shuffledCategoryPhotos.map((photo, i) => (
                    <motion.div
                      key={`${photo.webp}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`relative overflow-hidden rounded-2xl bg-muted border border-white/5 group
                        ${photo.orientation === 'portrait' ? 'row-span-2' : 'col-span-2'}
                      `}
                    >
                      <picture className="w-full h-full">
                        <source srcSet={photo.webp} type="image/webp" />
                        <ImageWithFallback
                          src={photo.original}
                          alt={`${selectedCategory} - ${i}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </picture>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}