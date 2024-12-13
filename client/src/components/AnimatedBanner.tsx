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
    <div className="w-64 h-40 relative overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ 
            opacity: 0,
            x: position === 'left' ? -100 : 100 
          }}
          animate={{ 
            opacity: 1,
            x: 0
          }}
          exit={{ 
            opacity: 0,
            x: position === 'left' ? 100 : -100
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}
