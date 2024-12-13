import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { ChannelSidebar } from './ChannelSidebar';
import { GuideTV } from './GuideTV';
import { useM3uData } from '@/hooks/useM3uData';
import { usePrograms } from '@/hooks/usePrograms';
import type { Channel } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const { data: channels } = useM3uData();
  const currentChannel = channels?.find(c => c.url === currentUrl);
  const { data: programs } = usePrograms(currentChannel?.id);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'i' || e.key === 'Info') {
        e.preventDefault();
        setShowGuide(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleChannelSelect = (channel: Channel) => {
    setCurrentUrl(channel.url);
    setShowSidebar(false);
  };

  return (
    <div className="fixed inset-0 bg-black">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 flex gap-2"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGuide(prev => !prev)}
            className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
            title="Guide des programmes (touche Info ou i)"
          >
            <Info className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0">
        <ReactPlayer
          url={currentUrl}
          width="100%"
          height="100%"
          playing
          controls
          playsinline
          config={{
            file: {
              forceVideo: true,
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>

      <ChannelSidebar 
        isVisible={showSidebar} 
        onChannelSelect={handleChannelSelect}
      />

      {currentChannel && (
        <GuideTV
          channels={[currentChannel]}
          isVisible={showGuide}
          onClose={() => setShowGuide(false)}
        />
      )}
    </div>
  );
}
