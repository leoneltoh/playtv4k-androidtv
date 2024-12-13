import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Channel, Program } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Film, 
  Tv, 
  Music, 
  Trophy, 
  Globe, 
  BookOpen,
  Baby,
  Theater,
  Radio
} from "lucide-react";

interface GuideTVProps {
  channels: Channel[];
  isVisible: boolean;
  onClose: () => void;
  allPrograms: Program[] | undefined;
  programsLoading: boolean;
}

export function GuideTV({ channels, isVisible, onClose, allPrograms, programsLoading }: GuideTVProps) {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 1
          }}
          className="fixed inset-0 bg-gradient-to-br from-black/90 via-black/85 to-purple-900/80 backdrop-blur-sm z-50 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-4 bg-black/40">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-pink-500/20"
              >
                <Calendar className="w-6 h-6 text-pink-400" />
              </Button>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                Guide des Programmes
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-pink-400" />
              <span className="text-pink-200">
                {format(selectedDate, "EEEE d MMMM", { locale: fr })}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6"
            >
              {channels.map((channel) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10"
                >
                  <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center space-x-4">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-12 h-12 object-contain rounded-lg bg-black/40 p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
                        <Tv className="w-6 h-6 text-pink-400" />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
                  </div>

                  <div className="p-4">
                      {isLoading ? (
                        <div className="animate-pulse space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-white/10 rounded-lg" />
                          ))}
                        </div>
                      ) : channel.programs && channel.programs.length > 0 ? (
                        channel.programs.map((program) => (
                          <motion.div
                            key={program.id}
                            whileHover={{ scale: 1.02 }}
                            className="py-2 border-b border-white/10 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Film className="w-4 h-4 text-pink-400" />
                                <span className="text-white/90">{program.title}</span>
                              </div>
                              <span className="text-sm text-pink-300">
                                {format(new Date(program.startTime), "HH:mm")} - 
                                {format(new Date(program.endTime), "HH:mm")}
                              </span>
                            </div>
                            {program.description && (
                              <p className="mt-1 text-sm text-white/60 ml-7">
                                {program.description}
                              </p>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-white/60 text-center">Aucun programme disponible</p>
                      )}
                    </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}