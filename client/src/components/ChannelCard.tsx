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
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="focus-within:outline-none focus-within:ring-2 focus-within:ring-primary rounded-lg"
    >
      <Card
        className="cursor-pointer overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border border-white/20"
        onClick={() => setLocation(`/watch/${channel.id}`)}
      >
        <div className="aspect-video relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {channel.logo ? (
            <img 
              src={channel.logo} 
              alt={channel.name}
              className="w-full h-full object-contain p-4 bg-transparent transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <span className="text-3xl font-bold text-primary/90">{channel.name[0]}</span>
            </div>
          )}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <p className="text-sm text-white/90">Cliquez pour regarder</p>
          </motion.div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate text-center">{channel.name}</h3>
        </div>
      </Card>
    </motion.div>
  );
}