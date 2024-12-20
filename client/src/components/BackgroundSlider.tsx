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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all(
      images.map((src) => {
        const img = new Image();
        img.src = src;
        return new Promise((resolve) => {
          img.onload = resolve;
        });
      })
    ).then(() => {
      setLoaded(true);
    });

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  if (!loaded) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black/90" /> {/* Overlay sombre */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }} {/* Opacité réduite à 15% */}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <img
            src={images[currentIndex]}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
