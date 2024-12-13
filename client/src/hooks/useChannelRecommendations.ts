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
    const now = Date.now();
    const dayStart = new Date().setHours(0, 0, 0, 0);
    
    // Nettoyer l'historique des entrées de plus de 30 jours
    const recentHistory = history.filter(entry => (now - entry.timestamp) <= 30 * 24 * 60 * 60 * 1000);
    
    // Calculer les statistiques de visionnage pour aujourd'hui
    const todayEntries = recentHistory.filter(entry => entry.timestamp >= dayStart);
    const todayDuration = todayEntries.reduce((acc, entry) => acc + entry.duration, 0);
    
    const newEntry = {
      channelId,
      timestamp: now,
      duration: 0,
      dayTotal: todayDuration
    };
    
    recentHistory.push(newEntry);
    
    while (recentHistory.length > 100) {
      recentHistory.shift();
    }

    localStorage.setItem('viewingHistory', JSON.stringify(recentHistory));
    
    // Sauvegarder les statistiques quotidiennes
    const stats = JSON.parse(localStorage.getItem('viewingStats') || '{}');
    const dayKey = new Date(dayStart).toISOString().split('T')[0];
    stats[dayKey] = (stats[dayKey] || 0) + 1;
    localStorage.setItem('viewingStats', JSON.stringify(stats));
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
