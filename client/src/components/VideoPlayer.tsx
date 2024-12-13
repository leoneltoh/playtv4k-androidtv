import ReactPlayer from 'react-player';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Info, PictureInPicture2 } from 'lucide-react';
import { ChannelSidebar } from './ChannelSidebar';
import { GuideTV } from './GuideTV';
import { useM3uData } from '@/hooks/useM3uData';
import type { Channel } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { usePiPMode } from '@/hooks/usePiPMode';
import { useChannelRecommendations } from '@/hooks/useChannelRecommendations';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const { data: channels } = useM3uData();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreen = async () => {
      try {
        const elem = document.documentElement;
        const isInFullscreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
        
        if (!isInFullscreen) {
          if (elem.requestFullscreen) {
            await elem.requestFullscreen();
          } else if ((elem as any).webkitRequestFullscreen) {
            await (elem as any).webkitRequestFullscreen();
          }
          setIsFullscreen(true);
        }
      } catch (error) {
        console.warn('Fullscreen not available:', error);
      }
    };

    handleFullscreen();

    const handleFullscreenChange = () => {
      const isInFullscreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(!!isInFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Menu' || e.key === 'ContextMenu' || e.key === 'Enter') {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.channel-sidebar')) {
        setShowSidebar(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleChannelSelect = (channel: Channel) => {
    const { addToHistory, updateDuration } = useChannelRecommendations(channels || []);
    const previousChannel = channels?.find(c => c.url === currentUrl);
    
    if (previousChannel) {
      const viewingDuration = Date.now() - lastChannelChangeTime;
      updateDuration(previousChannel.id, viewingDuration);
    }
    
    setCurrentUrl(channel.url);
    setShowSidebar(false);
    addToHistory(channel.id);
    setLastChannelChangeTime(Date.now());
  };
  
  const [lastChannelChangeTime, setLastChannelChangeTime] = useState(Date.now());

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Menu' || e.key === 'ContextMenu') {
      e.preventDefault();
      setShowSidebar(prev => !prev);
      setShowGuide(false);
    } else if (e.key === 'g' || e.key === 'G' || e.key === 'i' || e.key === 'I' || e.key === 'Info' || e.key === 'F1') {
      e.preventDefault();
      setShowGuide(prev => !prev);
      setShowSidebar(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
        <AnimatePresence>
          {!isFullscreen && (
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowGuide(prev => !prev)}
                className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
                title="Planning TV"
              >
                <Calendar className="w-6 h-6 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  usePiPMode.getState().togglePiP(currentUrl);
                }}
                className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
                title="Mode Picture-in-Picture"
              >
                <PictureInPicture2 className="w-6 h-6 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <GuideTV
          channels={channels || []}
          isVisible={showGuide}
          onClose={() => setShowGuide(false)}
        />
      <ReactPlayer
        url={currentUrl}
        width="100%"
        height="100%"
        playing
        controls
        pip={false}
        stopOnUnmount={false}
        playsinline
        fallback={null}
        config={{
          file: {
            attributes: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000'
              }
            }
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000'
        }}
      />
      <ChannelSidebar isVisible={showSidebar} onChannelSelect={handleChannelSelect} />
    </div>
  );
}
