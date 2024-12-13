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
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} />
      ))}
    </motion.div>
  );
}
