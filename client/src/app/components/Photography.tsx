import { useState, useMemo, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";
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
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Obtenemos una foto de portada por categoría
  const featuredPhotos = useMemo(() => {
    return photoData.reduce((acc: Photo[], current: any) => {
      if (!acc.find((p) => p.category === current.category)) {
        acc.push(current as Photo);
      }
      return acc;
    }, []);
  }, []);

  // Filtramos y mezclamos las fotos de la categoría seleccionada
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
      className="relative w-full overflow-hidden bg-background h-auto md:min-h-screen py-20" 
      onClick={() => setActiveCard(null)}
    >
      
      {/* 1. BACKGROUND IMAGE (Usando WebP) */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          filter: (activeCard || selectedCategory) ? "blur(12px) brightness(0.4)" : "blur(0px) brightness(0.7)",
          scale: activeCard ? 1.05 : 1
        }}
        transition={{ duration: 0.8 }}
      >
        <ImageWithFallback
          src="/photography/Paisaje/10.webp" 
          alt="Background"
          className="w-full h-full object-cover object-center opacity-40" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
      </motion.div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col items-center justify-start px-6 pt-10 md:pt-32"> 

        <div className="max-w-4xl w-full text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter"
          >
            {t.title}<span className="text-primary text-glow">{t.titleHighlight}</span>
          </motion.h2>
          
          <p className="text-sm md:text-xl text-muted-foreground italic leading-relaxed max-w-2xl mx-auto opacity-80">
            {t.subtitle}
          </p>
        </div>

        {/* INTERFAZ DE ABANICO */}
        <div className="relative w-full max-w-6xl h-75 md:h-137.5 flex items-center justify-center">
          {featuredPhotos.map((photo, index) => {
            const total = featuredPhotos.length;
            const angleFactor = isMobile ? 12 : 18;
            const rotation = (index - (total - 1) / 2) * angleFactor; 
            const isActive = activeCard === photo.category;

            return (
              <motion.div
                key={photo.category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                animate={{
                  y: isActive ? (isMobile ? -40 : -100) : 0, 
                  rotate: isActive ? 0 : rotation,
                  scale: isActive ? 1.1 : 1,
                  zIndex: isActive ? 50 : index,
                }}
                className="absolute w-45 md:w-87.5 cursor-pointer origin-bottom"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(photo.category);
                }}
              >
                <div className={`relative bg-muted/20 backdrop-blur-md p-2 rounded-2xl border transition-all duration-500
                  ${isActive ? 'border-primary/60 shadow-[0_0_50px_rgba(34,197,94,0.2)]' : 'border-white/10 shadow-2xl'}
                `}>
                  <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                    <ImageWithFallback
                      src={photo.webp} // Solo usamos WebP
                      alt={photo.category}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-transparent p-4">
                      <h3 className="text-white text-lg md:text-2xl font-bold tracking-tighter">
                        {t.categories?.[photo.category as keyof typeof t.categories] || photo.category}
                      </h3>
                      <p className={`text-primary font-bold tracking-widest uppercase text-[10px] mt-1 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
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

      {/* 3. MODAL DE GALERÍA DE CATEGORÍA */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-background/98 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedCategory(null)}
          >
            <div className="w-full max-w-7xl h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                  {t.categories?.[selectedCategory as keyof typeof t.categories] || selectedCategory}
                </h2>
                <button
                  className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-full transition-all border border-white/10"
                  onClick={() => setSelectedCategory(null)}
                >
                  <X size={32} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-20">
                  {shuffledCategoryPhotos.map((photo, i) => (
                    <motion.div
                      key={`${photo.webp}-${i}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`relative overflow-hidden rounded-2xl bg-muted/20 border border-white/5 group cursor-zoom-in
                        ${photo.orientation === 'portrait' ? 'row-span-2' : 'col-span-2'}
                      `}
                      onClick={() => setFullscreenPhoto(photo.webp)}
                    >
                      <ImageWithFallback
                        src={photo.webp} // WebP for Grid
                        alt={`${selectedCategory} - ${i}`}
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

      {/* 4. VISTA FULLSCREEN (SINGLE PHOTO) */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setFullscreenPhoto(null)}
          >
            <button
              className="absolute top-8 right-8 z-210 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white backdrop-blur-xl border border-white/10"
              onClick={() => setFullscreenPhoto(null)}
            >
              <X size={28} />
            </button>

            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={fullscreenPhoto} // Usando el mismo WebP
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}