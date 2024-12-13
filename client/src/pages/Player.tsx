import { useParams, useLocation } from "wouter";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useM3uData } from "@/hooks/useM3uData";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function Player() {
  const { channelId } = useParams();
  const [, setLocation] = useLocation();
  const { data: channels } = useM3uData();
  
  const channel = channels?.find(c => c.id === channelId);

  if (!channel) {
    return <div>Chaîne non trouvée</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-black"
    >
      <div className="flex items-center p-4 bg-background/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">{channel.name}</h1>
      </div>

      <div className="flex-1">
        <VideoPlayer url={channel.url} title={channel.name} />
      </div>
    </motion.div>
  );
}
