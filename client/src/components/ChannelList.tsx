import { ChannelCard } from "./ChannelCard";
import type { Channel } from "@/lib/types";
import { motion } from "framer-motion";
import { useFavoriteChannels } from "@/hooks/useFavoriteChannels";
import { Star } from "lucide-react";

interface ChannelListProps {
  channels: Channel[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ChannelList({ channels }: ChannelListProps) {
  const { getFavoriteChannels } = useFavoriteChannels();
  const favoriteChannels = getFavoriteChannels(channels);
  const nonFavoriteChannels = channels.filter(
    channel => !favoriteChannels.find(fav => fav.id === channel.id)
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 px-4 relative z-10"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {favoriteChannels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-pink-400" />
            <h2 className="text-xl font-semibold text-pink-200">Chaînes favorites</h2>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d"
            }}
          >
            {favoriteChannels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, rotateX: -15, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: index * 0.1,
                  ease: [0.34, 1.56, 0.64, 1],
                  opacity: { duration: 0.6 },
                  scale: { duration: 0.8 }
                }}
              >
                <ChannelCard channel={channel} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white/80 mb-4">Toutes les chaînes</h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          {nonFavoriteChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, rotateX: -15, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: [0.34, 1.56, 0.64, 1],
                opacity: { duration: 0.6 },
                scale: { duration: 0.8 }
              }}
            >
              <ChannelCard channel={channel} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
