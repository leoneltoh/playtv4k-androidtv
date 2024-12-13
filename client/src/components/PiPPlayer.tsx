import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PiPPlayerProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PiPPlayer({ url, isOpen, onClose }: PiPPlayerProps) {
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 280 });
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState<'small' | 'large'>('small');

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - (size === 'small' ? 320 : 480)),
        y: Math.min(prev.y, window.innerHeight - (size === 'small' ? 180 : 270))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  const toggleSize = () => {
    setSize(prev => prev === 'small' ? 'large' : 'small');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{
            left: 0,
            top: 0,
            right: window.innerWidth - (size === 'small' ? 320 : 480),
            bottom: window.innerHeight - (size === 'small' ? 180 : 270)
          }}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            width: size === 'small' ? 320 : 480,
            height: size === 'small' ? 180 : 270,
            x: position.x,
            y: position.y
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{ position: 'fixed', zIndex: 50 }}
          className="bg-black rounded-lg overflow-hidden border border-white/20 shadow-xl"
        >
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/20"
                onClick={toggleSize}
              >
                {size === 'small' ? (
                  <Maximize2 className="h-3 w-3 text-white/80" />
                ) : (
                  <Minimize2 className="h-3 w-3 text-white/80" />
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-3 w-3 text-white/80" />
            </Button>
          </div>
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            playing
            volume={0.5}
            muted={false}
            playsinline
            pip={false}
            controls
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }
                }
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
