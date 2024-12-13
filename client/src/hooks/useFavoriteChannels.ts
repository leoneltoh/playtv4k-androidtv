import { useState, useEffect } from 'react';
import type { Channel } from '@/lib/types';

export function useFavoriteChannels() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteChannels');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteChannels', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (channelId: string) => {
    setFavorites(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      }
      return [...prev, channelId];
    });
  };

  const isFavorite = (channelId: string) => favorites.includes(channelId);

  const getFavoriteChannels = (channels: Channel[]) => {
    return channels.filter(channel => favorites.includes(channel.id));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteChannels
  };
}
