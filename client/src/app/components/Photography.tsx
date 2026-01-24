import { useState, useMemo } from "react"; // Sumamos useMemo
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import photoData from "../../data/photos.json";

interface Photo {
  webp: string;
  original: string;
  category: string;
  orientation: 'portrait' | 'landscape';
}

// Función de mezcla (Fisher-Yates) para que sea pro
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function Photography() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredPhotos = photoData.reduce((acc: Photo[], current: any) => {
    if (!acc.find((p) => p.category === current.category)) {
      acc.push(current as Photo);
    }
    return acc;
  }, []);

  // Usamos useMemo para filtrar y mezclar solo cuando cambia la categoría
  const shuffledCategoryPhotos = useMemo(() => {
    if (!selectedCategory) return [];

    const filtered = photoData
      .filter((p: any) => p.category === selectedCategory)
      .map((p: any) => ({
        ...p,
        orientation: p.orientation || 'landscape'
      })) as Photo[];

    return shuffleArray(filtered);
  }, [selectedCategory]); // Solo se ejecuta al abrir/cambiar de galería

  return (
    <section id="photography" className="py-24 bg-background text-foreground transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
          >
            Mirada <span className="text-primary text-glow">Visual</span>
          </motion.h2>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            Un resumen conciso de mi trayectoria y lo que hago con la cámara. Es la esencia de mi trabajo, lo que define mi voz como fotógrafo.
          </p>
        </div>

        {/* Vista Principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredPhotos.map((photo, index) => (
            <motion.div
              key={photo.category} // Mejor usar el ID o categoría que el index
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-4/5 overflow-hidden rounded-3xl cursor-pointer group border border-white/5 bg-muted"
              onClick={() => setSelectedCategory(photo.category)}
            >
              <picture className="w-full h-full">
                <source srcSet={photo.webp} type="image/webp" />
                <img
                  src={photo.original}
                  alt={photo.category}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
              </picture>
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <p className="text-primary font-bold tracking-[0.2em] uppercase text-[10px] mb-2">Ver Galería</p>
                <h3 className="text-white text-2xl font-bold tracking-tight">{photo.category}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal con Grilla Aleatoria */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-background/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 lg:p-12"
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
                      key={`${photo.webp}-${i}`} // Key única para evitar problemas de render
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }} // Delay más corto para que se sienta fluido
                      className={`relative overflow-hidden rounded-2xl bg-muted border border-white/5 group
                        ${photo.orientation === 'portrait' ? 'row-span-2' : 'col-span-2'}
                      `}
                    >
                      <picture className="w-full h-full">
                        <source srcSet={photo.webp} type="image/webp" />
                        <img
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