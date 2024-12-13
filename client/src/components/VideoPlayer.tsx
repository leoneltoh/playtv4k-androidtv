import ReactPlayer from 'react-player';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Info, Maximize2, Minimize2, PictureInPicture } from 'lucide-react';
import { ChannelSidebar } from './ChannelSidebar';
import { GuideTV } from './GuideTV';
import { useM3uData } from '@/hooks/useM3uData';
import { useChannelRecommendations } from '@/hooks/useChannelRecommendations';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleFullscreen = async () => {
    try {
      const elem = document.documentElement;
      const isInFullscreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
      
      if (!isInFullscreen) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen not available:', error);
    }
  };

  const togglePiP = async () => {
    try {
      if (!videoRef.current) return;
      
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (error) {
      console.warn('Picture-in-Picture not available:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(!!isInFullscreen);
    };

    const handlePiPChange = () => {
      setIsPiP(!!document.pictureInPictureElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('enterpictureinpicture', handlePiPChange);
    document.addEventListener('leavepictureinpicture', handlePiPChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('enterpictureinpicture', handlePiPChange);
      document.removeEventListener('leavepictureinpicture', handlePiPChange);
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
        playsinline
        config={{
          file: {
            forceVideo: true,
            attributes: {
              controlsList: 'nodownload',
              playsInline: true,
              autoPlay: true,
              ref: videoRef,
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: '0',
                left: '0',
                objectFit: 'contain',
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
            onClick={togglePiP}
            className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
            title={isPiP ? "Quitter le mode PiP" : "Mode Picture-in-Picture"}
          >
            <PictureInPicture className={`w-6 h-6 ${isPiP ? 'text-pink-400' : 'text-white'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-black/50 backdrop-blur-sm hover:bg-pink-500/30 transition-colors duration-300"
            title={isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-6 h-6 text-white" />
            ) : (
              <Maximize2 className="w-6 h-6 text-white" />
            )}
          </Button>
        </motion.div>
      </AnimatePresence>
      <ChannelSidebar isVisible={showSidebar} onChannelSelect={handleChannelSelect} />
    </div>
  );
}
