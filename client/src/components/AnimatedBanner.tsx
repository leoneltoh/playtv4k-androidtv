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
    <div className={`w-72 h-44 relative overflow-hidden ${
        position === 'left' 
          ? 'rounded-r-3xl rounded-l-lg transform -rotate-2' 
          : 'rounded-l-3xl rounded-r-lg transform rotate-2'
      } border border-white/20 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-500 group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm z-10" />
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          initial={{ 
            opacity: 0,
            x: position === 'left' ? -100 : 100,
            rotate: position === 'left' ? -10 : 10
          }}
          animate={{ 
            opacity: 1,
            x: 0,
            rotate: 0
          }}
          exit={{ 
            opacity: 0,
            x: position === 'left' ? 100 : -100,
            rotate: position === 'left' ? 10 : -10
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-20" />
    </div>
  );
}
