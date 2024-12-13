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
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    };

    enterFullscreen();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Menu' || e.key === 'ContextMenu' || e.key === 'Enter') {
        setShowSidebar(prev => !prev);
      }
    };

    const handleClick = () => {
      setShowSidebar(prev => !prev);
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
              poster: '',
              controlsList: 'nodownload',
              className: 'w-full h-full',
              'x-webkit-airplay': 'allow',
              playsInline: true,
              autoPlay: true,
              'data-fullscreen': 'true',
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                objectFit: 'contain'
              }
            }
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      <ChannelSidebar isVisible={showSidebar} onChannelSelect={handleChannelSelect} />
    </div>
  );
}
