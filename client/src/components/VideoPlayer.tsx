import { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Tv2, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChannelSidebar } from './ChannelSidebar';
import { GuideTV } from './GuideTV';
import { useM3uData } from '@/hooks/useM3uData';
import { usePrograms } from '@/hooks/usePrograms';
import type { Channel } from '@/lib/types';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const { data: channels } = useM3uData();
  const currentChannel = channels?.find(c => c.url === currentUrl);
  const { data: programs } = usePrograms(currentChannel?.id);

  const toggleFullscreen = () => {
    const video = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (!video) return;
    
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.log(`Erreur lors du passage en plein écran : ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key.toLowerCase() === 'i' || e.key === 'Info') && !e.repeat) {
        e.preventDefault();
        setShowGuide(prev => !prev);
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          setShowGuide(false);
          setShowSidebar(false);
        }
      } else if (e.key.toLowerCase() === 's' && !e.repeat) {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      } else if (e.key.toLowerCase() === 'f' && !e.repeat) {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        const video = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
        if (video) {
          video.style.width = '100%';
          video.style.height = '100%';
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleChannelSelect = (channel: Channel) => {
    setCurrentUrl(channel.url);
    setShowSidebar(false);
  };

  const handleFullScreen = () => {
    toggleFullscreen();
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(prev => !prev)}
              className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
              title="Liste des chaînes (touche S)" 
            >
              <Tv2 className="w-6 h-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullScreen}
              className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
              title="Plein écran"
            >
              <Maximize className="w-6 h-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGuide(prev => !prev)}
              className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
              title="Guide des programmes (touche Info ou i)"
            >
              <Info className="w-6 h-6 text-white" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0">
        <ReactPlayer
          ref={playerRef}
          url={currentUrl}
          playing
          controls
          playsinline
          pip
          config={{
            file: {
              forceVideo: true,
              attributes: {
                controlsList: 'nodownload',
                style: { width: '100%', height: '100%', objectFit: 'contain' },
                className: 'react-player-video'
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
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
      {/* Removed redundant fullscreen button */}
    </div>
  );
}