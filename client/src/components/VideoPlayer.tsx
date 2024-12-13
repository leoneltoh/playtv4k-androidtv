import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  title: string;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  return (
    <div className="relative w-full h-full">
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
              poster: '', // Add default poster if needed
              controlsList: 'nodownload',
              className: 'w-full h-full'
            }
          }
        }}
      />
    </div>
  );
}
