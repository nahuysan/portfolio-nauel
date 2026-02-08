import { useState, useMemo, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 30 }
  }
};

export function Photography() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].photography;
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const featuredPhotos = useMemo(() => {
    return photoData.reduce((acc: Photo[], current: any) => {
      if (!acc.find((p) => p.category === current.category)) {
        acc.push(current as Photo);
      }
      return acc;
    }, []);
  }, []);

  const shuffledCategoryPhotos = useMemo(() => {
    if (!selectedCategory) return [];
    const filtered = photoData
      .filter((p: any) => p.category === selectedCategory)
      .map((p: any) => ({ ...p, orientation: p.orientation || 'landscape' })) as Photo[];
    return shuffleArray(filtered);
  }, [selectedCategory]);

  return (
    <section 
      id="photography" 
      className="relative w-full overflow-hidden bg-background h-auto md:min-h-[180vh] py-10 md:py-20"
      onClick={() => setActiveCard(null)}
    >
      {/* 1. BACKGROUND CON MÁSCARA (Seamless) */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          filter: (activeCard || selectedCategory) ? "blur(15px) brightness(0.25)" : "blur(0px) brightness(0.45)",
        }}
        transition={{ duration: 1 }}
        // La imagen se desvanece por máscara, no por overlay de color.
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        }}
      >
        <ImageWithFallback
          src="/photography/Paisaje/10.webp" 
          alt="Background"
          className="w-full h-full object-cover object-bottom opacity-40" 
        />
      </motion.div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col items-center justify-start px-6 pt-20 md:pt-45"> 
        
        <div className="max-w-4xl w-full text-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-5 md:mb-8 tracking-tighter"
          >
            {t.title}<span className="text-primary text-glow">{t.titleHighlight}</span>
          </motion.h2>
          <p className="text-[10px] md:text-lg text-muted-foreground italic max-w-2xl mx-auto opacity-70 leading-tight">
            {t.subtitle}
          </p>
        </div>

        {/* CONTENEDOR DE CARDS */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className={`relative w-full max-w-6xl flex items-center justify-center 
            ${isMobile ? 'flex-col pt-5 pb-48' : 'pt-10 h-[500px]'}`}
        >
          {featuredPhotos.map((photo, index) => {
            const total = featuredPhotos.length;
            const isActive = activeCard === photo.category;
            const rotation = isMobile ? 0 : (index - (total - 1) / 2) * 18;

            return (
              <motion.div
                key={photo.category}
                variants={cardVariants}
                animate={{
                  y: isMobile 
                    ? (isActive ? (index * -130) - 20 : index * -130) 
                    : (isActive ? -80 : 0), 
                  rotate: isActive ? 0 : rotation,
                  scale: isActive ? 1.05 : 1,
                  zIndex: isActive ? 50 : index,
                }}
                className={`${isMobile ? 'relative w-[92%] -mb-25' : 'absolute w-[320px]'} cursor-pointer origin-bottom`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isActive) {
                    setSelectedCategory(photo.category);
                  } else {
                    setActiveCard(photo.category);
                  }
                }}
              >
                <div className={`relative bg-muted/20 backdrop-blur-xl p-2 rounded-2xl border transition-all duration-500
                  ${isActive ? 'border-primary/60 shadow-[0_0_50px_rgba(var(--primary),0.3)]' : 'border-white/10 shadow-2xl'}
                `}>
                  <div className="relative aspect-video md:aspect-3/4 overflow-hidden rounded-xl">
                    <ImageWithFallback src={photo.webp} alt={photo.category} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/20 to-transparent p-4">
                      <h3 className="text-white text-xl md:text-2xl font-bold tracking-tighter">
                        {t.categories?.[photo.category as keyof typeof t.categories] || photo.category}
                      </h3>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0 }}
                            className="text-primary font-bold tracking-widest uppercase text-[10px] mt-1"
                          >
                            {t.viewGallery}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* MODAL Y FULLSCREEN */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedCategory(null)}
          >
            <div className="w-full max-w-7xl h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                  {t.categories?.[selectedCategory as keyof typeof t.categories] || selectedCategory}
                </h2>
                <button className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-full border border-white/10" onClick={() => setSelectedCategory(null)}>
                  <X size={32} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-20 auto-rows-fr">
  {shuffledCategoryPhotos.map((photo, i) => (
    <motion.div
      key={`${photo.webp}-${i}`}
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.02 }}
      className={`relative overflow-hidden rounded-2xl bg-muted/20 border border-white/5 group cursor-zoom-in 
        ${photo.orientation === 'portrait' 
          ? 'col-span-1 aspect-[3/4]' 
          : 'col-span-2 aspect-[3/2]' 
        }
      `}
      onClick={() => setFullscreenPhoto(photo.webp)}
    >
      <ImageWithFallback 
        src={photo.webp} 
        alt={`${selectedCategory} - ${i}`} 
        // object-cover es NO NEGOCIABLE acá para que no se estiren
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ZoomIn className="text-white opacity-60" size={40} />
      </div>
    </motion.div>
  ))}
</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setFullscreenPhoto(null)}
          >
            <button className="absolute top-8 right-8 z-[210] bg-white/10 p-4 rounded-full text-white backdrop-blur-xl border border-white/10" onClick={() => setFullscreenPhoto(null)}>
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={fullscreenPhoto} alt="Fullscreen" className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}