import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const images = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80', // Sports
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80', // Cinema
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&q=80', // Series
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1920&q=80'  // Movies
];

export function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.9, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/30 to-background/5" />
    </div>
  );
}
