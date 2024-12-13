import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedBannerProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  position: 'left' | 'right';
}

export function AnimatedBanner({ images, position }: AnimatedBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-2xl border border-white/20 backdrop-blur-sm bg-black/20 group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          initial={{ 
            opacity: 0,
            x: position === 'left' ? -100 : 100,
            scale: 1.1
          }}
          animate={{ 
            opacity: 1,
            x: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0,
            x: position === 'left' ? 100 : -100,
            scale: 0.9
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        />
      </AnimatePresence>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"
        initial={{ opacity: 0.6 }}
        whileHover={{ opacity: 0.4 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        initial={{ y: 100 }}
        whileHover={{ y: 0 }}
      >
        <div className="text-white text-shadow-lg">
          <h3 className="text-lg font-semibold mb-1">{images[currentIndex].alt}</h3>
          <p className="text-sm text-white/80">Cliquez pour plus d'informations</p>
        </div>
      </motion.div>
    </div>
  );
}
