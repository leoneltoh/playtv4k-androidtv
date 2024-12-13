import { useState } from "react";
import { motion } from "framer-motion";
import { BackgroundSlider } from "@/components/BackgroundSlider";
import { ChannelList } from "@/components/ChannelList";
import { SearchBar } from "@/components/SearchBar";
import { useM3uData } from "@/hooks/useM3uData";

export function Home() {
  const { data: channels, isLoading } = useM3uData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = channels?.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <motion.div
      className="min-h-screen w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BackgroundSlider />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          className="flex flex-col items-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-center"
            animate={{ 
              color: ["#ff69b4", "#ff1493", "#ff69b4"],
              textShadow: ["0 0 10px #ff69b4", "0 0 20px #ff1493", "0 0 10px #ff69b4"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            TV en Direct
          </motion.h1>
          <motion.p 
            className="text-lg text-pink-200/80 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Regardez vos chaînes préférées en streaming HD
          </motion.p>
          
          <SearchBar onSearch={setSearchQuery} />
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-48 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ChannelList channels={filteredChannels} />
        )}
      </div>
    </motion.div>
  );
}
