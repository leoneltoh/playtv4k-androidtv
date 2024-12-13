import { ChannelCard } from "./ChannelCard";
import type { Channel } from "@/lib/types";
import { motion } from "framer-motion";

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
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 relative z-10"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {channels.map((channel, index) => (
        <motion.div
          key={channel.id}
          initial={{ opacity: 0, rotateX: -15, y: 50 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          <ChannelCard channel={channel} />
        </motion.div>
      ))}
    </motion.div>
  );
}
