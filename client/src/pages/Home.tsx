import { ChannelList } from "@/components/ChannelList";
import { useM3uData } from "@/hooks/useM3uData";
import { motion } from "framer-motion";

export function Home() {
  const { data: channels, isLoading } = useM3uData();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/80"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            TV en Direct
          </h1>
          <p className="text-lg text-muted-foreground text-center">
            Regardez vos chaînes préférées en streaming HD
          </p>
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
          <ChannelList channels={channels || []} />
        )}
      </div>
    </motion.div>
  );
}
