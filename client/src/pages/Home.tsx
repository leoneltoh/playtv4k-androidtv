import { useState } from "react";
import { motion } from "framer-motion";
import { BackgroundSlider } from "@/components/BackgroundSlider";
import { ChannelList } from "@/components/ChannelList";
import { SearchBar } from "@/components/SearchBar";
import { AnimatedBanner } from "@/components/AnimatedBanner";
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
          
          <motion.div 
            className="flex flex-col items-center space-y-8 w-full max-w-7xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-transparent to-pink-500/20 blur-3xl -z-10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-2xl blur-xl -z-10" />
                  <AnimatedBanner
                    position="left"
                    images={[
                      {
                        src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80",
                        alt: "Football"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&q=80",
                        alt: "Jeux TV"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1495563125611-fa99f0cd529f?w=500&q=80",
                        alt: "Satellite"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80",
                        alt: "Régie TV"
                      }
                    ]}
                  />
                </motion.div>
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl -z-10" />
                  <AnimatedBanner
                    position="right"
                    images={[
                      {
                        src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80",
                        alt: "Cinéma"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80",
                        alt: "Service TV"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1568632234168-9fa6196059a5?w=500&q=80",
                        alt: "Équipement Audiovisuel"
                      },
                      {
                        src: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80",
                        alt: "Décodeur"
                      }
                    ]}
                  />
                </motion.div>
              </div>
              <motion.div 
                className="mt-8 relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-xl -z-10" />
                <SearchBar onSearch={setSearchQuery} />
              </motion.div>
            </div>
          </motion.div>
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
