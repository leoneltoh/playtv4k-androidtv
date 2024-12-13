import { useLocation } from "wouter";
import type { Channel } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ChannelCardProps {
  channel: Channel;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ChannelCard({ channel }: ChannelCardProps) {
  const [, setLocation] = useLocation();

  return (
    <motion.div 
      variants={item}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        rotateY: 5,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      }}
      whileTap={{ scale: 0.95, rotateY: -5 }}
      className="focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-500/50 rounded-lg transform-gpu perspective-1000"
    >
      <Card
        className="cursor-pointer overflow-hidden bg-gradient-to-br from-white/10 via-pink-500/5 to-white/5 backdrop-blur-md hover:from-white/15 hover:via-pink-500/10 hover:to-white/10 transition-all duration-700 border border-white/20 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:border-pink-300/30"
        onClick={() => setLocation(`/watch/${channel.id}`)}
      >
        <div className="aspect-video relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-pink-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          {channel.logo ? (
            <img 
              src={channel.logo} 
              alt={channel.name}
              className="w-full h-full object-contain p-4 bg-transparent transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm">
              <motion.span 
                className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {channel.name[0]}
              </motion.span>
            </div>
          )}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
            initial={false}
          >
            <p className="text-sm text-white font-medium">Cliquez pour regarder</p>
          </motion.div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate text-center bg-gradient-to-r from-pink-200 to-pink-100 bg-clip-text text-transparent group-hover:from-pink-100 group-hover:to-white transition-all duration-500">
            {channel.name}
          </h3>
        </div>
      </Card>
    </motion.div>
  );
}