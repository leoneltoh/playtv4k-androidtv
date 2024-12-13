import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import { ChannelSidebar } from './ChannelSidebar';
import type { Channel } from '@/lib/types';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
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
    setCurrentUrl(channel.url);
    setShowSidebar(false);
  };

  return (
    <div className="fixed inset-0 bg-black">
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
      <ChannelSidebar isVisible={showSidebar} onChannelSelect={handleChannelSelect} />
    </div>
  );
}
