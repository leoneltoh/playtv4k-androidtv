import ReactPlayer from 'react-player';
import { useEffect } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  useEffect(() => {
    // Demander le mode plein écran lors du chargement
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => {
        console.log('Erreur lors du passage en plein écran:', err);
      });
    }

    return () => {
      // Quitter le mode plein écran lors du démontage
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.log('Erreur lors de la sortie du plein écran:', err);
        });
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      <ReactPlayer
        url={url}
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
              webkitPlaysinline: true
            }
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}
