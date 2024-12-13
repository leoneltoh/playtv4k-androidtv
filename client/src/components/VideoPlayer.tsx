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

  useEffect(() => {
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
              autoPlay: true
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
