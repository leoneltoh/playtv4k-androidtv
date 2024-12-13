import { useState, useEffect } from 'react';
import type { Channel } from '@/lib/types';

interface ViewingHistory {
  channelId: string;
  timestamp: number;
  duration: number;
}

export function useChannelRecommendations(channels: Channel[]) {
  const [recommendations, setRecommendations] = useState<Channel[]>([]);
  
  useEffect(() => {
    const loadHistory = () => {
      const history: ViewingHistory[] = JSON.parse(localStorage.getItem('viewingHistory') || '[]');
      
      // Calculer les scores basés sur la fréquence et la durée de visionnage
      const scores = new Map<string, number>();
      
      history.forEach(view => {
        const existingScore = scores.get(view.channelId) || 0;
        const timeWeight = Math.max(0, 1 - (Date.now() - view.timestamp) / (7 * 24 * 60 * 60 * 1000)); // Diminue sur 7 jours
        scores.set(view.channelId, existingScore + (view.duration * timeWeight));
      });

      // Trier les chaînes par score
      const recommendedChannels = channels
        .filter(channel => scores.has(channel.id))
        .sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0))
        .slice(0, 5);

      // Ajouter quelques chaînes aléatoires si pas assez de recommandations
      if (recommendedChannels.length < 5) {
        const remainingChannels = channels.filter(
          channel => !recommendedChannels.some(rec => rec.id === channel.id)
        );
        
        while (recommendedChannels.length < 5 && remainingChannels.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingChannels.length);
          recommendedChannels.push(...remainingChannels.splice(randomIndex, 1));
        }
      }

      setRecommendations(recommendedChannels);
    };

    loadHistory();
    const interval = setInterval(loadHistory, 300000); // Actualiser toutes les 5 minutes
    
    return () => clearInterval(interval);
  }, [channels]);

  const addToHistory = (channelId: string) => {
    const history: ViewingHistory[] = JSON.parse(localStorage.getItem('viewingHistory') || '[]');
    
    history.push({
      channelId,
      timestamp: Date.now(),
      duration: 0 // Sera mis à jour lors de la fermeture
    });

    while (history.length > 100) { // Garder seulement les 100 dernières entrées
      history.shift();
    }

    localStorage.setItem('viewingHistory', JSON.stringify(history));
  };

  const updateDuration = (channelId: string, duration: number) => {
    const history: ViewingHistory[] = JSON.parse(localStorage.getItem('viewingHistory') || '[]');
    const lastEntry = history[history.length - 1];
    
    if (lastEntry && lastEntry.channelId === channelId) {
      lastEntry.duration = duration;
      localStorage.setItem('viewingHistory', JSON.stringify(history));
    }
  };

  return {
    recommendations,
    addToHistory,
    updateDuration
  };
}
