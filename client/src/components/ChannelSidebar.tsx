import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlternativeM3uData } from '@/hooks/useAlternativeM3uData';
import type { Channel } from '@/lib/types';

interface ChannelSidebarProps {
  isVisible: boolean;
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelSidebar({ isVisible, onChannelSelect }: ChannelSidebarProps) {
  const { data: channels, isLoading } = useAlternativeM3uData();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredChannels = channels?.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed left-0 top-0 h-full w-72 bg-black/80 backdrop-blur-sm z-50 overflow-hidden"
        >
          <div className="h-full flex flex-col p-4">
            <input
              type="text"
              placeholder="Rechercher une chaîne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            />
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-white/10 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredChannels.map((channel) => (
                    <motion.button
                      key={channel.id}
                      onClick={() => onChannelSelect(channel)}
                      className="w-full p-3 text-left bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        {channel.logo && (
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            className="w-8 h-8 object-contain mr-3"
                          />
                        )}
                        <span className="text-white group-hover:text-pink-300 transition-colors truncate">
                          {channel.name}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
